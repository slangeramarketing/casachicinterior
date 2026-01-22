"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import { BiChevronLeft, BiSave, BiGlobe, BiImage, BiLayout } from "react-icons/bi";
import { RiLoader2Fill } from "react-icons/ri";

// Actions & Libs
import { createBlogCategoryAction, updateBlogCategoryAction } from "@/app/actions/blog-category.action";

// Aapka image upload helper

// Custom Components
import { TextField, SelectField, TextAreaField } from "@/components/common/FormField"; 
import ImageUpload from "@/components/common/ImageUpload";
import { ChipInputField } from "@/components/common/ChipInputField";
import IconPickerDropDown from "@/components/admin/IconPickerDropDown";
import Alert, { AlertType } from "@/components/common/Alert";
import { uploadImage } from "@/lib/uploadImage";

interface CategoryFormProps {
  mode: "create" | "update";
  initialData?: BlogCategoryResponseDTO;
  allCategories?: BlogCategoryResponseDTO[];
}

export default function BlogCategoryForm({ mode, initialData, allCategories = [] }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // States
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState<any>({
    name: "",
    slug: "",
    description: "",
    parentId: null,
    status: "active",
    displayOrder: 0,
    icon: "default-icon",
    coverImage: "", 
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      metaRobots: "index, follow",
      canonicalUrl: ""
    }
  });

  useEffect(() => {
    if (mode === "update" && initialData) {
      setForm({ ...initialData });
    }
  }, [initialData, mode]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => {
      const newState = { ...prev, [name]: name === "displayOrder" ? Number(value) : value };
      if (name === "name" && mode === "create") {
        newState.slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      }
      return newState;
    });
  };

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, seo: { ...prev.seo, [name]: value } }));
  };

  // Main Submit Logic
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    // 1. Sabse pehle Validation check karein ✅
  const isValid = validateCategoryForm(form, selectedFile, mode, setAlert);
  if (!isValid) return;

    startTransition(async () => {
      try {
        let finalCoverImageUrl = form.coverImage;

        // 1. Image Upload Logic (Agar naya file select kiya hai)
        if (selectedFile) {
          try {
            finalCoverImageUrl = await uploadImage(selectedFile, "blogs");
          } catch (uploadErr: any) {
            throw new Error(`Image Upload Failed: ${uploadErr.message}`);
          }
        }

        // 2. Prepare Data for DB
        const finalData = { ...form, coverImage: finalCoverImageUrl };

        // 3. Trigger Server Action
        let result = mode === "update" 
          ? await updateBlogCategoryAction(initialData!.id, finalData) 
          : await createBlogCategoryAction(finalData);

        if (result.success) {
          setAlert({
            type: "success",
            title: mode === "create" ? "Category Created" : "Category Updated",
            message: "All changes have been saved and published successfully."
          });
          
          setTimeout(() => {
            router.push("/admin/blogs/categories");
            router.refresh();
          }, 1500);
        } else {
          setAlert({ type: "error", title: "Operation Failed", message: result.error });
        }
      } catch (err: any) {
        setAlert({ type: "error", title: "Something went wrong", message: err.message });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 backdrop-blur-md p-4 mb-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <BiChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">
             {mode === "create" ? "New Category" : "Modify Category"}
          </h1>
        </div>
        <button
          onClick={handleFormSubmit}
          disabled={isPending}
          className="bg-[#F97316] hover:bg-[#ea580c] text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-orange-100"
        >
          {isPending ? <RiLoader2Fill className="animate-spin" /> : <BiSave className="text-xl" />}
          {isPending ? "PROCESSING..." : (mode === "create" ? "PUBLISH" : "UPDATE")}
        </button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Content Section */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2"><BiLayout className="text-[#F97316]" /><h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest">General Content</h2></div>
            <TextField label="Category Name" name="name" value={form.name} onChange={handleInputChange} placeholder="e.g. Interior Lighting" />
            <TextField label="Slug" name="slug" value={form.slug} disabled className="bg-gray-50 text-gray-400" />
            <TextAreaField label="Description" name="description" value={form.description} onChange={handleInputChange} maxLength={500} />
          </div>

          {/* SEO Section */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2"><BiGlobe className="text-blue-500" /><h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Search Engine Optimization</h2></div>
            <TextField label="Meta Title" name="metaTitle" value={form.seo.metaTitle} onChange={handleSeoChange} />
            <TextAreaField label="Meta Description" name="metaDescription" value={form.seo.metaDescription} onChange={handleSeoChange} maxLength={160} />
            <ChipInputField 
               label="Keywords" name="keywords" value={form.seo.keywords} 
               onChange={(vals) => setForm({ ...form, seo: { ...form.seo, keywords: vals } })}
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Meta Robots" name="metaRobots" value={form.seo.metaRobots} onChange={handleSeoChange} options={[{ label: "Index, Follow", value: "index, follow" }, { label: "No Index", value: "noindex, follow" }]} />
              <TextField label="Canonical URL" name="canonicalUrl" value={form.seo.canonicalUrl} onChange={handleSeoChange} />
            </div>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
            {alert && (
              <div>
                <Alert {...alert} onClose={() => setAlert(null)} />
              </div>
            )}

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2"><BiImage className="text-purple-500" /><h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Media</h2></div>
            
            <div className="flex flex-col gap-4 space-y-4">
              <label className="text-sm font-medium text-gray-700">Choose Icon</label>
              <IconPickerDropDown value={form.icon} onChange={(id) => setForm({ ...form, icon: id })} />
            </div>

            <ImageUpload 
              label="Cover Image" 
              defaultValue={form.coverImage} 
              onChange={(file) => setSelectedFile(file)} // Local state mein file store kar rahe hain
              wrapperClassName="rounded-2xl overflow-hidden"
            />
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest border-b pb-4">Settings</h3>
            <SelectField 
              label="Parent" name="parentId" value={form.parentId || ""} 
              onChange={handleInputChange}
              options={allCategories.filter(c => c.id !== initialData?.id).map(c => ({ label: c.name, value: c.id }))} 
            />
            <TextField label="Display Order" name="displayOrder" type="number" value={form.displayOrder.toString()} onChange={handleInputChange} />
            <SelectField 
              label="Status" name="status" value={form.status} onChange={handleInputChange}
              options={[{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]} 
            />
          </div>
        </div>
      </form>
    </div>
  );
}



export const validateCategoryForm = (
  form: any, // Aapka category state
  selectedFile: File | null,
  mode: "create" | "update",
  setAlert: (alert: AlertType | null) => void
): boolean => {
  const errors: string[] = [];

  // 1. Basic Fields Check 📝
  if (!form.name.trim()) errors.push("Category name is required.");
  
  // 2. Slug Validation (lowercase, numbers, and hyphens only) 🔗
  const slugRegex = /^[a-z0-9-]+$/;
  if (!form.slug.trim()) {
    errors.push("Slug is mandatory.");
  } else if (!slugRegex.test(form.slug)) {
    errors.push("Slug should only contain lowercase letters, numbers, and hyphens.");
  }

  // 3. Visuals Validation (Image & Icon) 🖼️
  // Create mode mein image zaroori hai, update mein agar purani hai toh chalega
  if (mode === "create" && !selectedFile) {
    errors.push("Please upload a cover image for the category.");
  }

  if (!form.icon || form.icon === "default-icon") {
    errors.push("Please select a valid icon for the category.");
  }

  // 4. SEO Validation 🔍
  if (form.seo?.metaTitle && form.seo.metaTitle.length > 70) {
    errors.push("Meta Title is too long (Max 70 chars).");
  }
  
  if (form.seo?.metaDescription && form.seo.metaDescription.length > 160) {
    errors.push("Meta Description should be under 160 characters.");
  }

  // 5. Hierarchy Check 🌳
  // (Optional: check agar parent aur current category same toh nahi - ye select option mein handle hai but safe side ke liye)
  if (form.parentId && form.id && form.parentId === form.id) {
    errors.push("A category cannot be its own parent.");
  }

  // Final Action 🎬
  if (errors.length > 0) {
    setAlert({
      type: "error",
      title: "Validation Failed",
      message: errors[0], // Pehli error dikhao ya join karke sab dikha do: errors.join(" | ")
    });
    return false;
  }

  setAlert(null); 
  return true;
};