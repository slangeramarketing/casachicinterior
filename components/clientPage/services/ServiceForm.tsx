"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import Alert from "@/components/common/Alert";

import {
  TextField,
  TextAreaField,
  SelectField,
} from "@/components/common/FormField";

import ImageUpload from "@/components/common/ImageUpload";
import ImageGalleryUpload from "@/components/common/ImageGalleryUpload";
import { uploadImage } from "@/lib/uploadImage";
import { ChipInputField } from "@/components/common/ChipInputField";
// import ProcessStepsField, { ProcessStepInput } from "@/components/admin/ProcessStepsField";
import ServiceShowcaseForm from "@/components/admin/ServiceShowcaseForm";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";

/* =====================================================
   Types
===================================================== */
type ServiceFormMode = "create" | "update";

interface CategoryOption {
  id: string;
  name: string;
}



interface ServiceFormProps {
  mode: ServiceFormMode;
  categories: CategoryOption[];

  initialData?: {
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    categoryId: string;
    displayOrder: number;
    status: "draft" | "published";
    featured: boolean;
    coverImage?: string;
    gallery?: string[];
    highlights: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    ctaText?: string;
    ctaLink?: string;
  };

  onSubmit: (data: any) => Promise<void>;
}

/* =====================================================
   Component
===================================================== */
export default function ServiceForm({
  mode,
  categories,
  initialData,
  onSubmit,
}: ServiceFormProps) {
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
  } | null>(null);

  /* =========================
     Form State
  ========================= */
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    shortDescription: initialData?.shortDescription ?? "",
    description: initialData?.description ?? "",

    categoryId: initialData?.categoryId ?? "",
    displayOrder: initialData?.displayOrder ?? 0,
    status: initialData?.status ?? "draft",
    featured: initialData?.featured ?? false,

    coverImage: null as File | null,
    gallery: [] as File[],

    highlights: initialData?.highlights ?? [""],

    // processSteps: [] as ProcessStepInput[],

    seoTitle: initialData?.seoTitle ?? "",
    seoDescription: initialData?.seoDescription ?? "",
    seoKeywords: initialData?.seoKeywords?.join(", ") ?? "",
    ctaText: initialData?.ctaText ?? "",
    ctaLink: initialData?.ctaLink ?? "",
  });

  /* =========================
     Auto Slug (Create only)
  ========================= */
  useEffect(() => {
    if (mode === "create") {
      setForm((f) => ({
        ...f,
        slug: f.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  }, [form.title, mode]);


  /* =========================
    Submit
  ========================= */
  async function handleSubmit() {
    setLoading(true);
    setAlert(null);
    setProgress(0);

    try {
      /* -------------------------
        1. Upload Cover Image
      ------------------------- */
      let coverImageUrl = initialData?.coverImage || "";

      if (form.coverImage instanceof File) {
        coverImageUrl = await uploadImage(
          form.coverImage,
          "services"
        );
        setProgress(30);
      }

      /* -------------------------
        2. Upload Gallery Images
      ------------------------- */
      let galleryUrls: string[] = initialData?.gallery || [];

      if (form.gallery.length) {
        galleryUrls = [];

        for (let i = 0; i < form.gallery.length; i++) {
          const url = await uploadImage(
            form.gallery[i],
            "services"
          );
          galleryUrls.push(url);

          // progress calc (30 → 90)
          setProgress(
            30 + Math.floor(((i + 1) / form.gallery.length) * 60)
          );
        }
      }

      /* -------------------------
        3. Build Final Payload
      ------------------------- */
      const payload = {
        ...form,
        coverImage: coverImageUrl,
        gallery: galleryUrls,

        // clean up
        seoKeywords: form.seoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      };

      /* -------------------------
        4. Submit to Server
      ------------------------- */
      await onSubmit(payload);

      setProgress(100);

      setAlert({
        type: "success",
        title:
          mode === "create"
            ? "Service created"
            : "Service updated",
      });
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
    <div className="flex flex-col gap-6 pb-18 lg:px-8">
      <PageRouteHeader />
      <PageTitle
        title={
          mode === "create"
            ? "Create Service"
            : "Update Service"
        }
        description="Manage service details and presentation"
      />

      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}


      {/* STEP INDICATOR */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-md bg-bg-secondary border border-gray-300">
        {[
          "Basic",
          "Category",
          "Media",
          "Business",
          "SEO",
          "Finish",
        ].map((label, i) => {
          const current = i + 1;
          const isActive = step === current;
          const isCompleted = step > current;
          const isClickable = current <= step;

          return (
            <button
              key={label}
              type="button"
              disabled={!isClickable}
              onClick={() => setStep(current)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition
                ${
                  isActive
                    ? "bg-bg-primary text-white"
                    : isCompleted
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {/* Step Number */}
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold
                  ${
                    isActive
                      ? "bg-white text-bg-primary"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-500"
                  }
                `}
              >
                {current}
              </span>

              {/* Label */}
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>



      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <TextField
            label="Service Title"
            name="title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <TextField
            label="Slug"
            name="slug"
            value={form.slug}
            disabled={mode === "update"}
            onChange={() => {}}
          />

          <TextAreaField
            label="Short Description"
            name="shortDescription"
            value={form.shortDescription}
            maxLength={200}
            onChange={(e) =>
              setForm({
                ...form,
                shortDescription: e.target.value,
              })
            }
          />

          <TextAreaField
            label="Full Description"
            name="description"
            value={form.description}
            maxLength={800}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <Nav next={() => setStep(2)} />
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <>
          <SelectField
            label="Category"
            name="categoryId"
            value={form.categoryId}
            options={categories.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
            onChange={(e) =>
              setForm({
                ...form,
                categoryId: e.target.value,
              })
            }
          />

          <TextField
            label="Display Order"
            name="displayOrder"
            type="number"
            value={String(form.displayOrder)}
            onChange={(e) =>
              setForm({
                ...form,
                displayOrder: Number(e.target.value),
              })
            }
          />

          <SelectField
            label="Status"
            name="status"
            value={form.status}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as any,
              })
            }
          />

        <ToggleSwitch
          label="Featured Service"
          description="Featured services are highlighted on the homepage."
          checked={form.featured}
          onChange={(value) =>
            setForm({
              ...form,
              featured: value,
            })
          }
        />


          <Nav back={() => setStep(1)} next={() => setStep(3)} />
        </>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <>
          <ImageUpload
            label="Cover Image"
            onChange={(file) =>
              setForm({ ...form, coverImage: file })
            }
          />

          <ImageGalleryUpload
            label="Gallery"
            value={form.gallery}
            initialPreviews={initialData?.gallery}
            onChange={(files) =>
              setForm({ ...form, gallery: files })
            }
          />

          <Nav back={() => setStep(2)} next={() => setStep(4)} />
        </>
      )}

      {/* ================= STEP 4 ================= */}
      {step === 4 && (
        <>
          {/* <TextAreaField
            label="Highlights (comma separated)"
            name="highlights"
            placeholder="Premium materials, Custom design approach, On-time delivery, Transparent pricing"
            value={form.highlights.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                highlights: e.target.value.split(","),
              })
            }
          /> */}

          <ChipInputField
            label="Service Highlights"
            name="highlights"
            value={form.highlights}
            onChange={(values) =>
              setForm({ ...form, highlights: values })
            }
            placeholder="e.g. Modular kitchen, 10-year warranty"
            helperText="Press Enter or comma to add highlight"
          />


          {/* <ProcessStepsField
            label="Design & Execution Process"
            value={form.processSteps}
            onChange={(steps) =>
              setForm({ ...form, processSteps: steps })
            }
          /> */}

          <Nav back={() => setStep(3)} next={() => setStep(5)} />
        </>
      )}

      {/* ================= STEP 5 ================= */}
      {step === 5 && (
        <>
          <TextField
            label="SEO Title"
            name="seoTitle"
            value={form.seoTitle}
            onChange={(e) =>
              setForm({ ...form, seoTitle: e.target.value })
            }
          />

          <TextAreaField
            label="SEO Description"
            name="seoDescription"
            value={form.seoDescription}
            maxLength={160}
            onChange={(e) =>
              setForm({
                ...form,
                seoDescription: e.target.value,
              })
            }
          />

          <TextField
            label="CTA Text"
            name="ctaText"
            placeholder="e.g. Get Free Consultation"
            value={form.ctaText}
            onChange={(e) =>
              setForm({ ...form, ctaText: e.target.value })
            }
          />

          <TextField
            label="CTA Link"
            name="ctaLink"
            placeholder="e.g. /contact or https://example.com"
            value={form.ctaLink}
            onChange={(e) =>
              setForm({ ...form, ctaLink: e.target.value })
            }
          />

          <Nav back={() => setStep(4)} next={() => setStep(6)} />
        </>
      )}


      {/* ================= STEP 6 ================= */}
      {step === 6 && (
        <div className="border border-gray-300 rounded-xl bg-white flex flex-col items-center gap-6 px-10 py-10">

          {/* Title */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Final Submission
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Review completed. Submit your service to save changes.
            </p>
          </div>

          {/* Progress (only while loading) */}
          {loading && (
            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading & Processing</span>
                <span>{progress}%</span>
              </div>

              <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Images and data are being uploaded. Please wait…
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-2 rounded-md text-white text-sm font-medium transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {loading
              ? "Submitting..."
              : mode === "create"
              ? "Create Service"
              : "Update Service"}
          </button>

          {/* Back Nav */}
          {!loading && (
            <div className="w-full flex justify-start">
              <Nav back={() => setStep(6)} />
            </div>
          )}
        </div>
      )}

    </div>
  );
}

/* =========================
   Nav
========================= */
function Nav({
  next,
  back,
}: {
  next?: () => void;
  back?: () => void;
}) {
  return (
    <div className="flex justify-between mt-6">
      {back && (
        <button
          onClick={back}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          ← Back
        </button>
      )}
      {next && (
        <button
          onClick={next}
          className="px-4 py-2 bg-bg-primary text-white rounded"
        >
          Next →
        </button>
      )}
    </div>
  );
}
