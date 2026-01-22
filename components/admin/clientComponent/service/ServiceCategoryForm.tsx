"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import Alert from "@/components/common/Alert";
import { TextField, SelectField, TextAreaField } from "@/components/common/FormField"; // Aapka reusable component
import ImageUpload from "@/components/common/ImageUpload"; // Aapka reusable component
import { createServiceCategoryAction, updateServiceCategoryAction } from "@/app/actions/service-category.action";
import { INTERIOR_ICONS } from "@/public/assets/constants-icons/interior-icons";
import { ServiceCategoryResponseDTO } from "@/modules/service-category/service-category.dto";
import { uploadImage } from "@/lib/uploadImage";

interface ServiceCategoryFormProps {
  mode: "create" | "update";
  categories: ServiceCategoryResponseDTO[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    displayOrder: number;
    status: "active" | "inactive";
    icon?: string;
    thumbnail?: string;
    // Yeh hain wo flat fields jo hum server page se bhej rahe hain
    metaTitle?: string;
    metaDescription?: string;
  };
}

export default function ServiceCategoryForm({ mode, categories, initialData }: ServiceCategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; title: string; message?: string } | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    parentId: initialData?.parentId ?? "",
    displayOrder: initialData?.displayOrder ?? 0,
    status: initialData?.status ?? "active",
    icon: initialData?.icon ?? "consultation",
    metaTitle: initialData?.metaTitle ?? "",
    metaDescription: initialData?.metaDescription ?? "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  // Auto Slug logic
  useEffect(() => {
    if (mode === "create") {
      const generatedSlug = formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAlert(null); 

    try {
      let finalThumbnailUrl = initialData?.thumbnail || "";

      // 1. Image Upload Logic
      if (thumbnailFile) {
        finalThumbnailUrl = await uploadImage(thumbnailFile, "services");
      }

      // 2. Data Preparation (Mapping flat states to nested DTO)
      const submitData = {
        name: formData.name,
        slug: formData.slug,
        parentId: formData.parentId === "" ? null : formData.parentId,
        displayOrder: formData.displayOrder,
        status: formData.status,
        icon: formData.icon,
        thumbnail: finalThumbnailUrl,
        // 🔥 Fix: SEO fields ko DTO ke nested structure mein map kiya
        seo: {
          title: formData.metaTitle,
          description: formData.metaDescription,
        },
      };

      // 3. Server Action Call
      if (mode === "create") {
        // @ts-ignore (Agar DTO nested structure strictly check kar raha hai)
        await createServiceCategoryAction(submitData as any);
        setAlert({ 
          type: "success", 
          title: "Created", 
          message: "Category created successfully!" 
        });
      } else {
        // @ts-ignore
        await updateServiceCategoryAction(initialData!.id, submitData as any);
        setAlert({ 
          type: "success", 
          title: "Updated", 
          message: "Category updated successfully!" 
        });
      }
      
      // Redirect after success
      setTimeout(() => router.push("/admin/service/categories"), 1000);
      
    } catch (err: any) {
      console.error("Submit Error:", err);
      setAlert({ 
        type: "error", 
        title: mode === "create" ? "Creation Failed" : "Update Failed", 
        message: err.message || "Something went wrong" 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lg:px-8">
      <PageRouteHeader />
      <br/>
      <PageTitle 
        title={mode === "create" ? "Add Category" : "Edit Category"} 
        description="Fill in the details for service organization and SEO."
      />

        {alert && (<div  className="py-4"><Alert {...alert} onClose={() => setAlert(null)} /></div>)}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Main Info */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField 
              label="Category Name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. Modular Kitchen"
            />
            <TextField 
              label="Slug" 
              value={formData.slug} 
              disabled={mode === "update"}
              onChange={(e) => setFormData({...formData, slug: e.target.value})} 
            />
          </div>

          <SelectField 
            label="Parent Category"
            value={formData.parentId || ""}
            options={categories.filter(c => !c.parentId).map(c => ({ label: c.name, value: c.id }))}
            onChange={(e) => setFormData({...formData, parentId: e.target.value})}
          />

          {/* Icon Selector Grid */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Icon</label>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
              {INTERIOR_ICONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({...formData, icon: item.id})}
                  className={`p-2 flex flex-col items-center justify-center rounded-md border transition-all ${
                    formData.icon === item.id ? "bg-orange-500 text-white border-orange-600" : "hover:bg-gray-50 text-gray-500"
                  }`}
                >
                  <item.icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-300 pt-4">
            <h3 className="font-semibold text-gray-800">SEO Settings</h3>
            <TextField 
              label="Meta Title" 
              value={formData.metaTitle} 
              onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} 
            />
            <TextAreaField 
              label="Meta Description" 
              value={formData.metaDescription} 
              onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} 
              maxLength={160}
            />
          </div>
        </div>

        {/* Right Column: Media & Status */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-300 space-y-4">
            <ImageUpload 
              label="Category Thumbnail" 
              defaultValue={initialData?.thumbnail}
              onChange={(file) => setThumbnailFile(file)}
              wrapperClassName="rounded-lg overflow-hidden"
            />
            
            <TextField 
              label="Display Order" 
              type="number"
              value={formData.displayOrder.toString()} 
              onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})} 
            />

            <SelectField 
              label="Status"
              value={formData.status}
              options={[{label: "Active", value: "active"}, {label: "Inactive", value: "inactive"}]}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
            />
          </div>

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-2 bg-green-400  hover:bg-green-600 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}