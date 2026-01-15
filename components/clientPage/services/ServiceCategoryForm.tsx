"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PageRouteHeader,
  PageTitle,
} from "@/components/common/PageHeader";
import Alert from "@/components/common/Alert";

/* =====================================================
   Types
===================================================== */
interface ServiceCategoryFormProps {
  mode: "create" | "update";
  categories: {
    id: string;
    name: string;
    parentId: string | null;
  }[];
  initialData?: {
    name: string;
    slug: string;
    parentId: string | null;
    displayOrder: number;
    status: "active" | "inactive";
  };
  onSubmit: (data: {
    name: string;
    slug: string;
    parentId: string | null;
    displayOrder: number;
    status: "active" | "inactive";
  }) => Promise<void>;
}


interface CategoryOption {
  id: string;
  name: string;
}

/* =====================================================
   Component
===================================================== */
export default function ServiceCategoryForm({
  mode,
  categories,
  initialData,
  onSubmit,
}: ServiceCategoryFormProps) {
  const router = useRouter();

  /* =========================
     State (prefilled for update)
  ========================= */
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
  } | null>(null);

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [parentId, setParentId] = useState<string | null>(
    initialData?.parentId ?? null
  );
  const [displayOrder, setDisplayOrder] = useState(
    initialData?.displayOrder ?? 0
  );
  const [status, setStatus] = useState<
    "active" | "inactive"
  >(initialData?.status ?? "active");

  // const [categories, setCategories] = useState<
  //   CategoryOption[]
  // >([]);
  const [loading, setLoading] = useState(false);

  const mainCategories = categories.filter(
    (c) => c.parentId === null
  );


  /* =====================================================
     Auto Slug (CREATE only)
  ===================================================== */
  useEffect(() => {
    if (mode === "create") {
      setSlug(
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }, [name, mode]);


  /* =====================================================
     Submit Handler
  ===================================================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        name,
        slug,
        parentId,
        displayOrder,
        status,
      });

      setAlert({
        type: "success",
        title: "Category created",
        message: "Service category has been created successfully.",
      });

      // router.back();
    }catch(err:any){
      setAlert({
        type: "error",
        title: "Creation failed",
        message: err?.message || "You are not authorized to perform this action.",
      });

    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="w-full lg:px-4">
      <PageRouteHeader />
      <PageTitle
        title={
          mode === "create"
            ? "Create Service Category"
            : "Update Service Category"
        }
        description={
          mode === "create"
            ? "Create main category or sub-category for services"
            : "Update category details"
        }
      />

      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}


      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 space-y-6 max-w-3xl"
      >
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            readOnly={mode === "update"}
            className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
          />
        </div>

        {/* Parent */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Parent Category (optional)
          </label>
          <select
            value={parentId ?? ""}
            onChange={(e) =>
              setParentId(e.target.value || null)
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">— Main Category —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display Order */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Display Order
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) =>
              setDisplayOrder(Number(e.target.value))
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as any)
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-bg-primary px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create Category"
              : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
