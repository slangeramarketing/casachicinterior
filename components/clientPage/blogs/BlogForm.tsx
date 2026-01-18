"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import RichTextEditor from "@/components/admin/RichTextEditor";
import { uploadImage } from "@/lib/uploadImage";

import { CiEdit } from "react-icons/ci";
import { FaReadme } from "react-icons/fa6";

import SwitchToggle from "../../common/SwitchToggle";
import { ResponseCategoryDTO } from "@/modules/blog-category/category.dto";
import { SubCategoryResponseDTO } from "@/modules/blog-subcategory/subcategory.dto";
import {
  BlogResponseDTO,
  CreateBlogDTO,
  UpdateBlogDTO,
} from "@/modules/blogs/blog.dto";
import { SelectField, TextAreaField, TextField } from "@/components/common/FormField";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import ImageUpload from "@/components/common/ImageUpload";
import Alert, { AlertType } from "@/components/common/Alert";


export type BlogFormMode = "create" | "view" | "edit";

interface Props {
  mode: BlogFormMode;
  categories: ResponseCategoryDTO[];
  subcategories: SubCategoryResponseDTO[];
  initialData?: BlogResponseDTO;

  onCreate?: (data: CreateBlogDTO) => Promise<void>;
  onUpdate?: (id: string, data: UpdateBlogDTO) => Promise<void>;
}


const LIMITS = {
  DESCRIPTION: 200,
  META_TITLE: 50,
  META_DESCRIPTION: 150,
};

export default function BlogForm({
  mode,
  categories,
  subcategories,
  initialData,
  onCreate,
  onUpdate
}: Props) {
  const router = useRouter();

  const [currentMode, setCurrentMode] =
    useState<BlogFormMode>(mode);

  const isView = currentMode === "view";
  const isCreate = currentMode === "create";
  const isEdit = currentMode === "edit";

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [form, setForm] = useState<CreateBlogDTO>(() =>
    initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          richText: initialData.richText,
          thumbnailImage: initialData.thumbnailImage,
          categoryId: initialData.categoryId,
          subCategoryId: initialData.subCategoryId,
          status: initialData.status,
          featured: initialData.featured,
          seo: {
            metaTitle: initialData.seo?.metaTitle || "",
            metaDescription: initialData.seo?.metaDescription || "",
          },
        }
      : {
          title: "",
          slug: "",
          description: "",
          richText: "",
          thumbnailImage: "",
          categoryId: "",
          subCategoryId: "",
          status: "draft",
          featured: false,
          seo: {
            metaTitle: "",
            metaDescription: "",
          },
        }
  );

  /* -------------------------------------
     Derived SubCategories (by category)
  ------------------------------------- */
  // const filteredSubCategories = useMemo(() => {
  //   if (!form.categoryId) return [];
  //   return subcategories.filter(
  //     (s) => s.categoryId === form.categoryId
  //   );
  // }, [form.categoryId, subcategories]);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  /* -------------------------------------
     Submit
  ------------------------------------- */
const handleSubmit = async (status: "draft" | "published") => {
  console.log("status:", status);
  
  try {
    const validationError = validateForm();
    if (validationError) {
      setAlert({
        type: "error",
        title: "Validation Error",
        message: validationError,
      });
      
      return;
    }

    setLoading(true);

    let imageUrl = form.thumbnailImage;
    if (thumbnail) {
      imageUrl = await uploadImage(thumbnail, "blogs");
    }

    const payload = {
      ...form,
      status,
      slug: form.slug || generateSlug(form.title),
      thumbnailImage: imageUrl,
    };

    if (isCreate && onCreate) {
      await onCreate(payload as CreateBlogDTO);
    }

    if (isEdit && initialData && onUpdate) {
      await onUpdate(initialData.id, payload as UpdateBlogDTO);
    }

    router.push("/admin/blogs");
  } catch (err: any) {
     setAlert({
        type: "error",
        title: "Validation Error",
        message: err?.message,
      });
    
  } finally {
    setLoading(false);
  }
};


  /* -------------------------------------
     Validation
  ------------------------------------- */
  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (!form.description?.trim())
      return "Short description is required";
    if (form.description.length > LIMITS.DESCRIPTION)
      return "Description limit exceeded";

    if (!form.categoryId) return "Category is required";

    if (!form.richText || form.richText === "<p></p>")
      return "Blog content is required";

    if ((form.seo?.metaTitle ?? "").length > LIMITS.META_TITLE)
      return "Meta title limit exceeded";

    if ((form.seo?.metaDescription ?? "").length > LIMITS.META_DESCRIPTION)
      return "Meta description limit exceeded";


    return null;
  };

  /* -------------------------------------
     UI
  ------------------------------------- */
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* MAIN */}
      <div className="w-full lg:w-[80%]">
        <label className="text-sm text-gray-500">Title</label>
        <input
          disabled={isView}
          className="w-full border border-gray-300 rounded px-3 py-1 mb-4"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
              slug: generateSlug(e.target.value),
            })
          }
        />

        <RichTextEditor
          value={form.richText || ""}
          readOnly={isView}
          onChange={(v) =>
            setForm({ ...form, richText: v })
          }
        />
      </div>

      {/* SIDEBAR */}
      <div className="w-full lg:w-[20%] border border-gray-300 rounded p-2 flex flex-col gap-4">
        {mode !== "create" && (
          <div className="flex justify-end mb-3">
            {isView ? (
              <button onClick={() => setCurrentMode("edit")}>
                <CiEdit size={22} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setForm({
                    ...form,
                    ...initialData!,
                  });
                  setCurrentMode("view");
                }}
              >
                <FaReadme size={20} />
              </button>
            )}
          </div>
        )}

        <TextField 
            label="Slug" 
            placeholder="auto-generated-by-title"
            value={form.slug} 
            type="text" 
            onChange={()=> setForm({
              ...form, slug: generateSlug(form.title)
            })}
            labelClassName="text-xs !text-gray-500 px-2"
         />

         <TextAreaField
            label="Description"
            placeholder="Short description"
            value={form.description || ""}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            labelClassName="text-xs !text-gray-500 px-2"
         />

        {/* CATEGORY */}
        <SelectField
          label="Category"
          value={form.categoryId || ""}
          options={categories.map((s) => ({ label: s.name, value: s.id }))}
          disabled={isView}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId: e.target.value,
            })
          }
          labelClassName="text-xs !text-gray-500 px-2"
        />

        <SelectField
          label="Subcategory"
          value={form.subCategoryId || ""}
          options={subcategories.map((s) => ({ label: s.name, value: s.id }))}
          disabled={isView}
          onChange={(e) =>
            setForm({
              ...form,
              subCategoryId: e.target.value,
            })
          }
          labelClassName="text-xs !text-gray-500 px-2"
        />

        <ToggleSwitch
          label="Featured"
          checked={form.featured || false}
          disabled={loading} // 👈 Form submit hote waqt toggle disable ho jayega
          showDescription
          description="This is used to set this Blogs as Featured Blogs"
          onChange={(v) => setForm({ ...form, featured: v })}
        />

        <ImageUpload
            label="Thumnail-Upload"
            defaultValue={form.thumbnailImage} // 👈 Isse Edit mode mein image dikhegi
            onChange={(file) => setThumbnail(file)}
            labelClassName="text-xs"
            fileNameClassName="text-xs text-gray-400 bold"
        />

        {/* ====== meta ======== */}

        <TextField 
            label="meta-title" 
            value={form.seo?.metaTitle || ""} 
            type="text" 
            onChange={()=> setForm({
              ...form, seo: { ...form.seo, metaTitle: generateSlug(form.title) }
            })}
            labelClassName="text-xs !text-gray-500 px-2"
         />

         <TextAreaField
            label="meta-description"
            value={form.seo?.metaDescription || ""}
            onChange={(e) =>
              setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })
            }
            labelClassName="text-xs !text-gray-500 px-2"
         />

        {alert && (
        <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
        />
        )}

        {!isView && (
          <div className="flex flex-col gap-2 mt-4">
            {/* Publish Button */}
            <button
              onClick={() => handleSubmit("published")}
              disabled={loading} // Disable button while loading
              className={`w-full py-2 text-xs text-white transition-all flex items-center justify-center gap-2
                ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
            >
              {loading ? (
                <>
                  <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </>
              ) : (
                "Publish"
              )}
            </button>

            {/* Save Draft Button */}
            <button
              onClick={() => handleSubmit("draft")}
              disabled={loading} // Disable button while loading
              className={`w-full py-2 text-xs text-white transition-all flex items-center justify-center gap-2
                ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"}`}
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>
          </div>
        )}


      </div>
    </div>
  );
}
