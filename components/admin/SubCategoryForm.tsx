"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResponseCategoryDTO } from "@/modules/blog-category/category.dto";
import { CreateSubCategoryDTO, SubCategoryResponseDTO, UpdateSubCategoryDTO } from "@/modules/blog-subcategory/subcategory.dto";


/* -------------------------------------
   Props
------------------------------------- */
interface SubCategoryFormProps {
  initialData?: SubCategoryResponseDTO;
  subCategoryId?: string;
  categoryData: ResponseCategoryDTO[];
  onCreate?: (data: CreateSubCategoryDTO) => Promise<void>;
  onUpdate?: (id: string, data: UpdateSubCategoryDTO) => Promise<void>;
}

/* -------------------------------------
   Component
------------------------------------- */
export default function SubCategoryForm({
  initialData,
  subCategoryId,
  categoryData,
  onCreate,
  onUpdate
}: SubCategoryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(subCategoryId);

  const [form, setForm] = useState<CreateSubCategoryDTO>({
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    isActive: true,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------
     Prefill (EDIT)
  ------------------------------------- */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        categoryId: initialData.categoryId,
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  /* -------------------------------------
     Redirect after success
  ------------------------------------- */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push("/admin/blogs/subcategories");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  /* -------------------------------------
     Change Handler
  ------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
      ...(name === "name" &&
        !isEdit && {
          slug: value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-"),
        }),
    }));
  };

  /* -------------------------------------
     Submit
  ------------------------------------- */
  const handleSubmit = async (formData: FormData) => {
    try{
    setErrorMessage(null);
    setLoading(true);

    if (isEdit && onUpdate && subCategoryId) {
        await onUpdate(subCategoryId, form);
    }

    if (!isEdit && onCreate) {
        await onCreate(form);
    }
    
    router.push("/admin/blogs/categories");
  }catch (err: any) {
      setErrorMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }

  };

  /* -------------------------------------
     UI
  ------------------------------------- */
  return (
    <form
      action={handleSubmit}
      className="space-y-6 bg-white border border-gray-200 rounded-lg p-4"
    >
      {/* Error */}
      {errorMessage && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-medium">
          Category
        </label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="mt-1 w-full border-gray-300 border rounded px-3 py-2 text-sm"
        >
          <option value="">Select Category</option>
          {categoryData.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium">
          Sub-Category Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={loading}
          className="mt-1 w-full border-gray-300 border rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Slug */}
      <input type="hidden" name="slug" value={form.slug} />

      <div>
        <label className="block text-sm font-medium">
          Slug
        </label>
        <input
          value={form.slug}
          disabled
          className="mt-1 w-full border-gray-300 border rounded bg-gray-100 px-3 py-2 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">
          Description
        </label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          rows={4}
          disabled={loading}
          className="mt-1 w-full border-gray-300 border rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium">
          Status
        </label>
        <select
          name="isActive"
          value={form.isActive ? "true" : "false"}
          onChange={handleChange}
          disabled={loading}
          className="mt-1 w-full border-gray-300 border rounded px-3 py-2 text-sm"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="border px-4 py-2 text-sm rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || Boolean(successMessage)}
          className="bg-orange-500 px-5 py-2 text-sm text-white rounded disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isEdit
            ? "Update Sub-Category"
            : "Create Sub-Category"}
        </button>
      </div>
    </form>
  );
}
