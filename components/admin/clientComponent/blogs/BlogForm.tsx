"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CiSaveDown2 } from "react-icons/ci";
import { MdOutlinePublish } from "react-icons/md";

import RichTextEditor from "@/components/admin/RichTextEditor";
import { SelectField, TextAreaField, TextField } from "@/components/common/FormField";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import ImageUpload from "@/components/common/ImageUpload";
import Alert, { AlertType } from "@/components/common/Alert";

import { BlogResponseDTO, CreateBlogDTO, UpdateBlogDTO } from "@/modules/blogs/blog.dto";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import { ChipInputField } from "@/components/common/ChipInputField";
import { BiChevronDown, BiInfoCircle } from "react-icons/bi";
import { createBlogPostAction, updateBlogPostAction } from "@/app/actions/blog.action";
import { uploadImage } from "@/lib/uploadImage";
import { RiLoader4Fill } from "react-icons/ri";

export type BlogFormMode = "create" | "edit";

interface Props {
  mode: BlogFormMode;
  categories: BlogCategoryResponseDTO[];
  initialData?: BlogResponseDTO;
  currentUserId: string;
}

interface FieldDescriptionProps {

  text: string;

  className?: string;

}

export default function BlogForm({ mode, categories, initialData,currentUserId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);

  // 🔥 Image Files State
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [ogFile, setOgFile] = useState<File | null>(null);

  /* --- Form State --- */
  const [form, setForm] = useState<CreateBlogDTO>(() => ({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    content: initialData?.content || "",
    thumbnail: initialData?.thumbnail || "",
    bannerImage: initialData?.bannerImage || "",
    categoryId: initialData?.category?.id || "",
    authorId: initialData?.author?.id || currentUserId,
    tags: initialData?.tags || [],
    status: (initialData?.status as any) || "draft",
    featured: initialData?.featured || false,
    seo: {
      metaTitle: initialData?.seo?.metaTitle || "",
      metaDescription: initialData?.seo?.metaDescription || "",
      keywords: initialData?.seo?.keywords || [],
      ogImage: initialData?.seo?.ogImage || "",
      canonicalUrl: initialData?.seo?.canonicalUrl || "",
      metaRobots: initialData?.seo?.metaRobots || "index, follow",
    },
  }));

  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleTitleChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: mode === "create" ? generateSlug(val) : prev.slug,
    }));
  };

  const handleSubmit = async (status: "draft" | "published") => {
    // 1. Validation

    console.log("Payload Form: ",form)
    const isValid = validateBlogForm(form, setAlert);
    if (!isValid) return;

    setLoading(true);
    setAlert(null);

    try {
      // 2. Image Handling Logic
      let thumbUrl = form.thumbnail;
      let bannerUrl = form.bannerImage;
      let ogImageUrl = form.seo?.ogImage || "";

      // Parallel Uploads for better speed
      const uploadPromises = [];

      if (thumbnailFile) uploadPromises.push(uploadImage(thumbnailFile, "blogs").then(url => thumbUrl = url));
      if (bannerFile) uploadPromises.push(uploadImage(bannerFile, "blogs").then(url => bannerUrl = url));
      if (ogFile) uploadPromises.push(uploadImage(ogFile, "blogs").then(url => ogImageUrl = url));

      await Promise.all(uploadPromises);

      // 3. Prepare Final Payload
      const payload = {
        ...form,
        status,
        thumbnail: thumbUrl,
        bannerImage: bannerUrl,
        seo: {
          ...form.seo!,
          ogImage: ogImageUrl
        }
      };

      // 4. Server Action
      const result = mode === "create"
        ? await createBlogPostAction(payload as CreateBlogDTO)
        : await updateBlogPostAction(initialData!.id, payload as UpdateBlogDTO);

      if (result.success) {
        setAlert({ type: "success", title: "Success!", message: `Post ${mode === "create" ? "published" : "updated"} successfully.` });
        setTimeout(() => {
          router.push("/admin/blogs");
          router.refresh();
        }, 1500);
      } else {
        setAlert({ type: "error", title: "Action Failed", message: result.error });
      }

    } catch (err: any) {
      setAlert({ type: "error", title: "Upload/Server Error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-2 max-w-[1400px] mx-auto">
      {/* LEFT: MAIN CONTENT AREA */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-2 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <TextField
            label="Post Title"
            placeholder="Enter a catchy title..."
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-xl font-bold"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Slug (URL)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
            <SelectField
              label="Category"
              value={form.categoryId}
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            />
          </div>

          <TextAreaField
            label="Short Summary"
            placeholder="Brief description for blog cards..."
            value={form.summary || ""}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Content</label>
            <RichTextEditor
              value={form.content}
              onChange={(v) => setForm({ ...form, content: v })}
            />
          </div>
        </div>

        {/* SEO SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-800">SEO Settings 🔍</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Meta Title"
              value={form.seo?.metaTitle || ""}
              onChange={(e) => setForm({ ...form, seo: { ...form.seo!, metaTitle: e.target.value } })}
            />
            <div>
              <TextField
                label="Canonical URL"
                value={
                  form.slug
                    ? `${window.location.origin}/blogs/${form.slug}`
                    : ""
                }
                disabled
              />
              <FieldDescription text="Canonical URL automatically generated using blog slug." />

            </div>
            
            <ChipInputField
              label="SEO Keywords"
              name="keywords"
              value={form.seo?.keywords || []}
              onChange={(values) => setForm({ ...form, seo: { ...form.seo!, keywords: values } })}
            />

            <SelectField
              label="Meta Robots"
              value={form.seo?.metaRobots || "index, follow"}
              options={[
                { label: "Index, Follow", value: "index, follow" },
                { label: "No Index, No Follow", value: "noindex, nofollow" },
              ]}
              onChange={(e) => setForm({ ...form, seo: { ...form.seo!, metaRobots: e.target.value } })}
            />

            <div className="md:col-span-2">
              <TextAreaField
                label="Meta Description"
                value={form.seo?.metaDescription || ""}
                onChange={(e) => setForm({ ...form, seo: { ...form.seo!, metaDescription: e.target.value } })}
              />
            </div>

            {/* OG Image Upload */}
            <div className="md:col-span-2">
              <ImageUpload
                id="Og-upload" // 👈 Unique ID
                label="OG Image (Social Sharing)"
                defaultValue={form.seo?.ogImage || ""}
                onChange={(file) => setOgFile(file)}
              />
              <FieldDescription text="WhatsApp/Facebook par share karte waqt dikhne wali image." />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: SIDEBAR */}
      <div className="w-full lg:w-80 space-y-6">
        {alert && (
          <div className="sticky top-4 z-50 animate-in slide-in-from-top-4">
            <Alert type={alert.type} title={alert.title} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        {/* PUBLISH CARD */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase border-b pb-3 tracking-widest">Status & Visibility</h3>
          
          <ToggleSwitch
            label="Featured Post"
            checked={form.featured || false}
            onChange={(v) => setForm({ ...form, featured: v })}
          />

          <div className="space-y-2">
            <button
              onClick={() => handleSubmit("published")}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-100"
            >
              {loading ? <RiLoader4Fill className="animate-spin text-xl" /> : <MdOutlinePublish size={20} />}
              {mode === "create" ? "PUBLISH POST" : "UPDATE POST"}
            </button>
            <button
              onClick={() => handleSubmit("draft")}
              disabled={loading}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <CiSaveDown2 size={20} />
              Save to Drafts
            </button>
          </div>
        </div>

        {/* TAGS */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-tighter">Taxonomy 🏷️</h3>
          <ChipInputField
            label="Post Tags"
            name="tags"
            value={form.tags || []}
            onChange={(values) => setForm({ ...form, tags: values })}
            placeholder="Type and press Enter..."
          />
        </div>

        {/* MEDIA CARD */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-tighter">Media Assets 🖼️</h3>
          <div>
            <ImageUpload
             id="thumbnail-upload" // 👈 Unique ID dena mat bhulna
              label="Thumbnail"
              defaultValue={form.thumbnail}
              onChange={(file) => setThumbnailFile(file)}
              preset="thumbnail"
            />
            <FieldDescription text="Blog card image (600x400px)." />
          </div>
          <div>
            <ImageUpload
            id="banner-upload" // 👈 Unique ID
              label="Banner"
              defaultValue={form.bannerImage}
              onChange={(file) => setBannerFile(file)}
              preset="banner"
            />
            <FieldDescription text="Top header high-res image." />
          </div>
        </div>
      </div>
    </div>
  );
}

// ... RiLoader2Fill import add kar lena react-icons/ri se

export function FieldDescription({ text, className = "" }: FieldDescriptionProps) {

  const [isOpen, setIsOpen] = useState(false);



  return (

    <div className={`mt-1 ${className}`}>

      {/* Trigger Button: Sirf itna hi hamesha dikhega */}

      <button

        type="button"

        onClick={() => setIsOpen(!isOpen)}

        className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-wider"

      >

        <BiInfoCircle size={12} />

        <span>Note</span>

        <BiChevronDown

          size={10}

          className={`transition-transform duration-200  ${isOpen ? "rotate-180" : ""}`}

        />

      </button>



      {/* Expandable Content */}

      <div

        className={`overflow-hidden transition-all duration-300 ease-in-out ${

          isOpen ? "max-h-20 opacity-100 mt-1" : "max-h-0 opacity-0"

        }`}

      >

        <p className="text-[11px] text-gray-500 bg-blue-50/50 p-2 rounded-md border-l-2 border-blue-400 leading-relaxed">

          {text}

        </p>

      </div>

    </div>

  );

}





// Is function ko main component ke BAHAR rakhein

export const validateBlogForm = (

  form: CreateBlogDTO,

  setAlert: (alert: AlertType | null) => void

): boolean => {

  const errors: string[] = [];



  // 1. Basic Fields Check 📝

  if (!form.title.trim()) errors.push("Title is required.");

  if (!form.categoryId) errors.push("Category selection is mandatory.");

  if (!form.content.trim() || form.content === "<p><br></p>") {

    errors.push("Content cannot be empty.");

  }



  // 2. Slug Validation 🔗

  const slugRegex = /^[a-z0-9-]+$/;

  if (!form.slug.trim()) {

    errors.push("Slug is required.");

  } else if (!slugRegex.test(form.slug)) {

    errors.push("Slug must be lowercase letters, numbers, and hyphens only.");

  }



  // 3. SEO Validation (Optional but recommended) 🔍

  if (form.seo?.metaTitle && form.seo.metaTitle.length > 60) {

    errors.push("Meta Title should be under 60 characters for best SEO.");

  }



  // Final Action 🎬

  if (errors.length > 0) {

    setAlert({

      type: "error",

      title: "Validation Error",

      message: errors.join(" "), // Saari errors ek saath dikhane ke liye

    });

    return false; // Validation fail

  }



  setAlert(null); // Purane alerts clear karein

  return true; // Validation pass

};
