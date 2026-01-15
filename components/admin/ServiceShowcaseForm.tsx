"use client";

/***************************************************
 * ServiceShowcaseForm
 *
 * Purpose:
 * - Create / Update service before-after showcase
 *
 * Responsibilities:
 * - Collect UI input only
 * - Manage local form state
 *
 * Restrictions:
 * - Must NOT call server directly
 ***************************************************/

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/common/ImageUpload";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import Alert from "@/components/common/Alert";

/* =====================================================
   Types
===================================================== */
type Mode = "create" | "update";

interface ServiceShowcaseFormProps {
  mode: Mode;

  initialData?: {
    title: string;
    problem: string;
    solution: string;
    result: string;
    beforeImage?: string;
    afterImage?: string;
    isActive: boolean;
  };

  onSubmit: (data: {
    title: string;
    problem: string;
    solution: string;
    result: string;
    beforeImage: File | null;
    afterImage: File | null;
    isActive: boolean;
  }) => Promise<void>;
}

/* =====================================================
   Component
===================================================== */
export default function ServiceShowcaseForm({
  mode,
  initialData,
  onSubmit,
}: ServiceShowcaseFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
  } | null>(null);

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    problem: initialData?.problem ?? "",
    solution: initialData?.solution ?? "",
    result: initialData?.result ?? "",
    beforeImage: null as File | null,
    afterImage: null as File | null,
    isActive: initialData?.isActive ?? true,
  });

  /* =====================================================
     Submit
  ===================================================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await onSubmit(form);

      setAlert({
        type: "success",
        title:
          mode === "create"
            ? "Showcase created"
            : "Showcase updated",
      });

      router.back();
    } catch (err: any) {
      setAlert({
        type: "error",
        title: "Operation failed",
        message: err?.message,
      });
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="space-y-6 lg:px-6">
      <PageRouteHeader />

      <PageTitle
        title={
          mode === "create"
            ? "Create Service Showcase"
            : "Update Service Showcase"
        }
        description="Before & After transformation for this service"
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
        className="bg-white border border-gray-300 rounded-xl p-6 space-y-6 max-w-4xl"
      >
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Showcase Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
            placeholder="e.g. Living Room Renovation"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            label="Before Image"
            onChange={(file) =>
              setForm({ ...form, beforeImage: file })
            }
          />

          <ImageUpload
            label="After Image"
            onChange={(file) =>
              setForm({ ...form, afterImage: file })
            }
          />
        </div>

        {/* Case Study */}
        <div className="grid grid-cols-1 gap-4">
          <textarea
            placeholder="Problem faced before renovation"
            value={form.problem}
            onChange={(e) =>
              setForm({ ...form, problem: e.target.value })
            }
            rows={3}
            className="border rounded-md px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Solution we provided"
            value={form.solution}
            onChange={(e) =>
              setForm({ ...form, solution: e.target.value })
            }
            rows={3}
            className="border rounded-md px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Final result / outcome"
            value={form.result}
            onChange={(e) =>
              setForm({ ...form, result: e.target.value })
            }
            rows={3}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">
            Active (visible on service page)
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="border px-4 py-2 text-sm rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-bg-primary text-white px-5 py-2 text-sm rounded-md disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create Showcase"
              : "Update Showcase"}
          </button>
        </div>
      </form>
    </div>
  );
}
