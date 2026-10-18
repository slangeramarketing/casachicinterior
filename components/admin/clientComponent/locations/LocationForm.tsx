"use client";

/***************************************************
 * File: components/admin/clientComponent/locations/LocationForm.tsx
 * Purpose:
 * - Create / edit one location landing page
 * - Client-side checks mirror the server rules for fast feedback;
 *   the server remains the authority (location.service.ts)
 ***************************************************/

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import Alert from "@/components/common/Alert";
import { SelectField, TextAreaField, TextField } from "@/components/common/FormField";
import { ChipInputField } from "@/components/common/ChipInputField";
import ImagePicker from "@/components/common/ImagePicker";
import { FAQsManager } from "@/components/admin/clientComponent/service/ServiceFormHelperFiled";
import { uploadImage } from "@/lib/uploadImage";
import { slugify } from "@/lib/utils/slugify";
import { createLocationAction, updateLocationAction } from "@/app/actions/location.action";
import {
  LocationBudgetDTO,
  LocationFaqDTO,
  LocationInputDTO,
  LocationResponseDTO,
  LocationTestimonialDTO,
} from "@/modules/locations/location.dto";
import { LocationMetaRobots, LocationStatus } from "@/modules/locations/location.types";
import {
  LOCATION_LIMITS,
  LOCATION_META_ROBOTS_OPTIONS,
  LOCATION_STATUSES,
} from "@/modules/locations/location.constants";
import { ServiceResponseDTO } from "@/modules/services/service.dto";

type ImageValue = File | string | null;

interface ProjectDraft {
  title: string;
  locality: string;
  flatSize: string;
  scope: string;
  description: string;
  image: ImageValue;
}

interface LocationFormProps {
  mode: "create" | "update";
  initialData?: LocationResponseDTO;
  /** Published services the page can link to. */
  services: ServiceResponseDTO[];
  /** Public origin, used for the address preview only. */
  siteUrl: string;
}

const STATUS_LABELS: Record<LocationStatus, string> = {
  draft: "Draft (not on the website)",
  published: "Published (live on the website)",
  disabled: "Disabled (kept, but returns 404)",
};

const L = LOCATION_LIMITS;

export default function LocationForm({ mode, initialData, services, siteUrl }: LocationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; title: string; message?: string } | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "update");

  const [form, setForm] = useState({
    areaName: initialData?.areaName ?? "",
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    intro: initialData?.intro ?? "",
    heroImage: (initialData?.heroImage || null) as ImageValue,
    localities: initialData?.localities ?? ([] as string[]),
    serviceIds: initialData?.serviceIds ?? ([] as string[]),
    projects: (initialData?.projects ?? []).map((p) => ({ ...p, image: (p.image || null) as ImageValue })) as ProjectDraft[],
    budgets: (initialData?.budgets ?? []) as LocationBudgetDTO[],
    testimonials: (initialData?.testimonials ?? []) as Required<LocationTestimonialDTO>[],
    faqs: (initialData?.faqs ?? []) as LocationFaqDTO[],
    ctaText: initialData?.ctaText ?? "Book a Free Consultation",
    ctaLink: initialData?.ctaLink ?? "/contact",
    metaTitle: initialData?.metaTitle ?? "",
    metaDescription: initialData?.metaDescription ?? "",
    keywords: initialData?.keywords ?? ([] as string[]),
    metaRobots: (initialData?.metaRobots ?? "index, follow") as LocationMetaRobots,
    status: (initialData?.status ?? "draft") as LocationStatus,
  });

  // The address follows the heading until the admin edits it by hand.
  useEffect(() => {
    if (mode === "create" && !slugTouched) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, mode, slugTouched]);

  /* ---------- client-side validation (mirrors server) ---------- */
  const errors = useMemo(() => {
    const e: string[] = [];
    if (!form.areaName.trim()) e.push("Area name is required.");
    if (!form.title.trim()) e.push("Page heading is required.");
    if (!form.slug.trim()) e.push("Address (slug) is required.");
    if (form.metaTitle.length > L.META_TITLE_MAX) e.push(`SEO title is over ${L.META_TITLE_MAX} characters.`);
    if (form.metaDescription.length > L.META_DESCRIPTION_MAX) e.push(`Meta description is over ${L.META_DESCRIPTION_MAX} characters.`);
    if (form.ctaLink.trim() && !/^(\/|https?:\/\/)/i.test(form.ctaLink.trim())) e.push("Button link must start with / or https://.");

    if (form.status === "published") {
      if (form.intro.trim().length < L.INTRO_MIN_TO_PUBLISH) {
        e.push(`Introduction needs at least ${L.INTRO_MIN_TO_PUBLISH} characters before publishing (${form.intro.trim().length} now).`);
      }
      if (form.localities.length < L.LOCALITIES_MIN_TO_PUBLISH) e.push(`Add at least ${L.LOCALITIES_MIN_TO_PUBLISH} localities before publishing.`);
      if (form.faqs.length < L.FAQS_MIN_TO_PUBLISH) e.push(`Add at least ${L.FAQS_MIN_TO_PUBLISH} FAQs before publishing.`);
      if (!form.metaTitle.trim()) e.push("SEO title is required before publishing.");
      if (!form.metaDescription.trim()) e.push("Meta description is required before publishing.");
    }
    return e;
  }, [form]);

  const previewUrl = `${siteUrl}/${form.slug || "..."}`;

  async function resolveImage(value: ImageValue): Promise<string> {
    if (value instanceof File) return uploadImage(value, "common");
    return typeof value === "string" ? value : "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (errors.length) {
      setAlert({ type: "error", title: "Please fix the highlighted issues", message: errors[0] });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const heroImage = await resolveImage(form.heroImage);
      const projects = [];
      for (const p of form.projects) {
        projects.push({ ...p, image: await resolveImage(p.image) });
      }

      const payload: LocationInputDTO = {
        slug: form.slug,
        areaName: form.areaName,
        title: form.title,
        intro: form.intro,
        heroImage,
        localities: form.localities,
        serviceIds: form.serviceIds,
        projects,
        budgets: form.budgets,
        testimonials: form.testimonials,
        faqs: form.faqs,
        ctaText: form.ctaText,
        ctaLink: form.ctaLink,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        keywords: form.keywords,
        metaRobots: form.metaRobots,
        status: form.status,
      };

      const result =
        mode === "create"
          ? await createLocationAction(payload)
          : await updateLocationAction(initialData!.id, payload, initialData!.slug);

      if (!result.success) {
        setAlert({ type: "error", title: mode === "create" ? "Could not save" : "Could not update", message: result.error });
        return;
      }

      setAlert({
        type: "success",
        title: mode === "create" ? "Location page created" : "Location page updated",
        message:
          result.data.status === "published"
            ? `Live at /${result.data.slug}.`
            : "Saved as a draft. Set the status to Published when the content is ready.",
      });
      setTimeout(() => router.push("/admin/locations"), 900);
    } catch (err) {
      setAlert({ type: "error", title: "Upload failed", message: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const toggleService = (id: string) =>
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(id)
        ? prev.serviceIds.filter((s) => s !== id)
        : [...prev.serviceIds, id],
    }));

  return (
    <div className="lg:px-8">
      <PageRouteHeader />
      <br />
      <PageTitle
        title={mode === "create" ? "Add Location Page" : `Edit: ${initialData?.areaName ?? ""}`}
        description="A landing page for one area you serve. Everything on it should be specific to that area."
      />

      {alert && (
        <div className="py-4">
          <Alert {...alert} onClose={() => setAlert(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ================= LEFT: content ================= */}
        <div className="md:col-span-2 space-y-6">
          {/* Basics */}
          <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">Area</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Area name*"
                value={form.areaName}
                placeholder="e.g. Greater Noida West"
                onChange={(e) => setForm({ ...form, areaName: e.target.value })}
              />
              <TextField
                label="Page heading (H1)*"
                value={form.title}
                placeholder="e.g. Interior Designers in Greater Noida West"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <TextField
                label="Address (slug)*"
                value={form.slug}
                disabled={mode === "update"}
                placeholder="interior-designers-greater-noida-west"
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: slugify(e.target.value) || e.target.value.toLowerCase() });
                }}
              />
              <p className="text-xs text-gray-400">
                {mode === "update"
                  ? "Fixed after creation so links and search rankings are not lost."
                  : "Lower-case words joined by hyphens. Follows the heading until you edit it."}
                {" "}Page will be at <span className="font-mono text-gray-600">{previewUrl}</span>
              </p>
            </div>
            <ImagePicker
              label="Hero image"
              value={form.heroImage}
              onChange={(v) => setForm({ ...form, heroImage: v })}
              className="w-full md:w-2/3 border-0"
              preset="banner"
            />
          </section>

          {/* Intro */}
          <section className="space-y-2 bg-white p-6 rounded-xl border border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">Introduction</h3>
            <p className="text-xs text-gray-500">
              Write about this area specifically: the kind of homes and offices there, what clients in the
              area ask for, how you work there. Separate paragraphs with a blank line. Pages that only swap
              the city name into the same text are penalised by Google.
            </p>
            <TextAreaField
              label={`Text (${form.intro.trim().length} characters, ${L.INTRO_MIN_TO_PUBLISH} needed to publish)`}
              value={form.intro}
              maxLength={L.INTRO_MAX}
              onChange={(e) => setForm({ ...form, intro: e.target.value })}
              placeholder="Casa Chic Interior has designed homes across Greater Noida West since..."
            />
          </section>

          {/* Localities + services */}
          <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">Localities and services</h3>
            <ChipInputField
              label={`Localities / sectors / societies served (${form.localities.length})`}
              name="localities"
              value={form.localities}
              onChange={(values) => setForm({ ...form, localities: values })}
              placeholder="Type a locality and press Enter, e.g. Gaur City 2"
              helperText={`At least ${L.LOCALITIES_MIN_TO_PUBLISH} to publish. Use the names residents actually search for.`}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Services offered in this area</p>
              {services.length === 0 ? (
                <p className="text-xs text-gray-400">No published services yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {services.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-[#F97316]"
                        checked={form.serviceIds.includes(s.id)}
                        onChange={() => toggleService(s.id)}
                      />
                      <span className="truncate">{s.title}</span>
                    </label>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400">Shown as links to the service pages. Leave all unticked to show the featured services.</p>
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">Projects completed in this area ({form.projects.length}/{L.PROJECTS_MAX})</h3>
            <p className="text-xs text-gray-500">Real projects only, with your own photos. This is the strongest proof that you work in the area.</p>
            <ProjectsManager
              items={form.projects}
              onChange={(items) => setForm({ ...form, projects: items })}
              max={L.PROJECTS_MAX}
            />
          </section>

          {/* Budgets */}
          <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">Typical budgets in this area ({form.budgets.length}/{L.BUDGETS_MAX})</h3>
            <BudgetsManager
              items={form.budgets}
              onChange={(items) => setForm({ ...form, budgets: items })}
              max={L.BUDGETS_MAX}
            />
          </section>

          {/* Testimonials */}
          <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-300">
            <h3 className="text-sm font-bold text-gray-800">Client reviews from this area ({form.testimonials.length}/{L.TESTIMONIALS_MAX})</h3>
            <TestimonialsManager
              items={form.testimonials}
              onChange={(items) => setForm({ ...form, testimonials: items })}
              max={L.TESTIMONIALS_MAX}
            />
          </section>

          {/* FAQs */}
          <section className="space-y-4 bg-white p-6 rounded-xl border border-gray-300">
            <FAQsManager
              label={`Area-specific FAQs (${form.faqs.length}, at least ${L.FAQS_MIN_TO_PUBLISH} to publish)`}
              items={form.faqs}
              onChange={(items) => setForm({ ...form, faqs: items })}
            />
            <p className="text-xs text-gray-400">
              Questions people in this area actually ask, e.g. &quot;Do you work in high-rise societies in Noida Extension?&quot;
            </p>
          </section>
        </div>

        {/* ================= RIGHT: status + SEO ================= */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-300 space-y-4">
            <SelectField
              label="Status"
              value={form.status}
              options={LOCATION_STATUSES.map((s) => ({ label: STATUS_LABELS[s], value: s }))}
              onChange={(e) => setForm({ ...form, status: e.target.value as LocationStatus })}
            />
            <SelectField
              label="Search engine directive"
              value={form.metaRobots}
              options={LOCATION_META_ROBOTS_OPTIONS.map((r) => ({ label: r, value: r }))}
              onChange={(e) => setForm({ ...form, metaRobots: e.target.value as LocationMetaRobots })}
            />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-300 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">Search engine listing</h3>
            <div className="flex flex-col gap-1">
              <TextField
                label={`SEO title (${form.metaTitle.length}/${L.META_TITLE_MAX})`}
                value={form.metaTitle}
                placeholder="Interior Designers in Greater Noida West | Casa Chic"
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className={form.metaTitle.length > L.META_TITLE_MAX ? "border-red-500" : ""}
              />
            </div>
            <TextAreaField
              label="Meta description"
              value={form.metaDescription}
              maxLength={L.META_DESCRIPTION_MAX}
              placeholder="One or two sentences with the area name and what you offer there."
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            />
            <ChipInputField
              label="Keywords"
              name="keywords"
              value={form.keywords}
              onChange={(values) => setForm({ ...form, keywords: values })}
              placeholder="e.g. interior designer greater noida west"
              helperText={`Up to ${L.KEYWORDS_MAX_COUNT}. The first one is the main phrase for this page.`}
            />
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <p className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">Search result preview</p>
              <p className="text-xs text-green-700 truncate">{previewUrl}</p>
              <p className="text-base text-blue-800 leading-snug truncate">{form.metaTitle || form.title || "Title will appear here"}</p>
              <p className="text-xs text-gray-600 line-clamp-2">{form.metaDescription || "The meta description will appear here."}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-300 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">Call to action</h3>
            <TextField
              label="Button text"
              value={form.ctaText}
              onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
            />
            <TextField
              label="Button link"
              value={form.ctaLink}
              placeholder="/contact"
              onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
            />
          </div>

          {errors.length > 0 && (
            <ul className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-3 space-y-1">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/locations")}
              className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-green-400 hover:bg-green-600 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =====================================================
   Repeaters
===================================================== */

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white";

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="text-gray-400 hover:text-red-500 text-lg leading-none px-1"
    >
      ✕
    </button>
  );
}

function ProjectsManager({
  items,
  onChange,
  max,
}: {
  items: ProjectDraft[];
  onChange: (items: ProjectDraft[]) => void;
  max: number;
}) {
  const empty: ProjectDraft = { title: "", locality: "", flatSize: "", scope: "", description: "", image: null };
  const [draft, setDraft] = useState<ProjectDraft>(empty);

  const add = () => {
    if (!draft.title.trim() || items.length >= max) return;
    onChange([...items, { ...draft, title: draft.title.trim() }]);
    setDraft(empty);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Project title, e.g. 3BHK at Gaur City 2" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <input className={inputCls} placeholder="Locality / society" value={draft.locality} onChange={(e) => setDraft({ ...draft, locality: e.target.value })} />
          <input className={inputCls} placeholder="Size, e.g. 3BHK, 1,450 sq ft" value={draft.flatSize} onChange={(e) => setDraft({ ...draft, flatSize: e.target.value })} />
          <input className={inputCls} placeholder="Scope, e.g. Full home interiors" value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value })} />
        </div>
        <textarea className={inputCls} rows={2} placeholder="One or two sentences about the brief and the result" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        <ImagePicker
          label="Project photo"
          value={draft.image}
          onChange={(v) => setDraft({ ...draft, image: v })}
          className="w-full md:w-1/2 border-0"
          preset="thumbnail"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.title.trim() || items.length >= max}
          className="w-50 bg-bg-secondary text-black border border-orange-400 border-dashed py-2 rounded text-sm hover:bg-orange-500 hover:text-white disabled:opacity-50"
        >
          + Add project
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((p, i) => (
            <li key={`${p.title}-${i}`} className="flex items-start justify-between gap-3 border border-gray-200 rounded-lg p-3 bg-white">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">{p.title}</p>
                <p className="text-xs text-gray-500">
                  {[p.locality, p.flatSize, p.scope].filter(Boolean).join(" · ") || "No details"}
                  {p.image ? " · photo attached" : " · no photo"}
                </p>
                {p.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{p.description}</p>}
              </div>
              <RemoveButton label={`Remove project ${p.title}`} onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BudgetsManager({
  items,
  onChange,
  max,
}: {
  items: LocationBudgetDTO[];
  onChange: (items: LocationBudgetDTO[]) => void;
  max: number;
}) {
  const [label, setLabel] = useState("");
  const [range, setRange] = useState("");

  const add = () => {
    if (!label.trim() || !range.trim() || items.length >= max) return;
    onChange([...items, { label: label.trim(), range: range.trim() }]);
    setLabel("");
    setRange("");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
        <input className={inputCls} placeholder="What, e.g. 2BHK full home interiors" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input className={inputCls} placeholder="Typical range, e.g. ₹8 – 12 lakh" value={range} onChange={(e) => setRange(e.target.value)} />
        <button
          type="button"
          onClick={add}
          disabled={!label.trim() || !range.trim() || items.length >= max}
          className="px-4 py-2 border border-orange-400 border-dashed rounded text-sm hover:bg-orange-500 hover:text-white disabled:opacity-50"
        >
          + Add
        </button>
      </div>
      {items.length > 0 && (
        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
          {items.map((b, i) => (
            <li key={`${b.label}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="text-gray-700">{b.label}</span>
              <span className="flex items-center gap-3">
                <span className="font-semibold text-gray-900">{b.range}</span>
                <RemoveButton label={`Remove budget ${b.label}`} onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-400">Shown as a guide table. Use ranges, not fixed prices, and keep them realistic for this area.</p>
    </div>
  );
}

function TestimonialsManager({
  items,
  onChange,
  max,
}: {
  items: Required<LocationTestimonialDTO>[];
  onChange: (items: Required<LocationTestimonialDTO>[]) => void;
  max: number;
}) {
  const empty = { name: "", locality: "", text: "", rating: 5 };
  const [draft, setDraft] = useState(empty);

  const add = () => {
    if (!draft.name.trim() || !draft.text.trim() || items.length >= max) return;
    onChange([...items, { ...draft, name: draft.name.trim(), text: draft.text.trim() }]);
    setDraft(empty);
  };

  return (
    <div className="space-y-3">
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className={inputCls} placeholder="Client name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input className={inputCls} placeholder="Locality, e.g. Sector 150" value={draft.locality} onChange={(e) => setDraft({ ...draft, locality: e.target.value })} />
          <select className={inputCls} value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>
            ))}
          </select>
        </div>
        <textarea className={inputCls} rows={3} placeholder="What the client said, in their words" value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
        <button
          type="button"
          onClick={add}
          disabled={!draft.name.trim() || !draft.text.trim() || items.length >= max}
          className="w-50 bg-bg-secondary text-black border border-orange-400 border-dashed py-2 rounded text-sm hover:bg-orange-500 hover:text-white disabled:opacity-50"
        >
          + Add review
        </button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((t, i) => (
            <li key={`${t.name}-${i}`} className="flex items-start justify-between gap-3 border border-gray-200 rounded-lg p-3 bg-white">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {t.name} <span className="text-xs font-normal text-gray-500">{t.locality && `· ${t.locality}`} · {t.rating}/5</span>
                </p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 italic">“{t.text}”</p>
              </div>
              <RemoveButton label={`Remove review by ${t.name}`} onClick={() => onChange(items.filter((_, idx) => idx !== i))} />
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-400">Only real reviews from clients in this area. Invented testimonials damage trust and can be penalised.</p>
    </div>
  );
}
