"use client";

/***************************************************
 * File: components/admin/clientComponent/seo/PageSeoForm.tsx
 * Purpose:
 * - Create / edit one page SEO entry
 * - Client-side checks mirror the server limits for fast feedback;
 *   the server remains the authority (seo.service.ts)
 ***************************************************/

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import Alert from "@/components/common/Alert";
import { SelectField, TextAreaField, TextField } from "@/components/common/FormField";
import { ChipInputField } from "@/components/common/ChipInputField";
import { createPageSeoAction, updatePageSeoAction } from "@/app/actions/seo.action";
import { PageSeoResponseDTO } from "@/modules/seo/seo.dto";
import { MetaRobots, PageSeoStatus } from "@/modules/seo/seo.types";
import { META_ROBOTS_OPTIONS, PAGE_SEO_STATUSES, SEO_LIMITS } from "@/modules/seo/seo.constants";
import { MANAGED_PAGES } from "@/lib/seo/managedPages";

interface PageSeoFormProps {
  mode: "create" | "update";
  /** Routes that already have an entry (other than the one being edited). */
  usedRoutes: string[];
  /** Pre-select a route when arriving from the "Set up" button. */
  presetRoute?: string;
  initialData?: PageSeoResponseDTO;
  /** Public origin, used for the search-result preview only. */
  siteUrl: string;
}

const STATUS_LABELS: Record<PageSeoStatus, string> = {
  draft: "Draft (not applied to the website)",
  published: "Published (live on the website)",
  disabled: "Disabled (kept, but not applied)",
};

export default function PageSeoForm({
  mode,
  usedRoutes,
  presetRoute,
  initialData,
  siteUrl,
}: PageSeoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; title: string; message?: string } | null>(null);

  const [form, setForm] = useState({
    route: initialData?.route ?? presetRoute ?? "",
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    primaryKeyword: initialData?.primaryKeyword ?? "",
    secondaryKeywords: initialData?.secondaryKeywords ?? ([] as string[]),
    heading: initialData?.heading ?? "",
    metaRobots: (initialData?.metaRobots ?? "index, follow") as MetaRobots,
    canonicalUrl: initialData?.canonicalUrl ?? "",
    ogImage: initialData?.ogImage ?? "",
    status: (initialData?.status ?? "draft") as PageSeoStatus,
  });

  const routeOptions = useMemo(
    () =>
      MANAGED_PAGES.filter(
        (p) => p.route === initialData?.route || !usedRoutes.includes(p.route)
      ).map((p) => ({ label: `${p.label}  (${p.route})`, value: p.route })),
    [usedRoutes, initialData?.route]
  );

  const selectedPage = MANAGED_PAGES.find((p) => p.route === form.route);

  /* ---------- client-side validation (mirrors server) ---------- */
  const errors = useMemo(() => {
    const e: string[] = [];
    if (!form.route) e.push("Choose the page this entry applies to.");
    if (form.title.length > SEO_LIMITS.TITLE_MAX) e.push(`Title is over ${SEO_LIMITS.TITLE_MAX} characters.`);
    if (form.description.length > SEO_LIMITS.DESCRIPTION_MAX) e.push(`Meta description is over ${SEO_LIMITS.DESCRIPTION_MAX} characters.`);
    if (form.status === "published" && !form.title.trim()) e.push("A title is required before publishing.");
    if (form.status === "published" && !form.description.trim()) e.push("A meta description is required before publishing.");
    if (form.canonicalUrl.trim() && !/^https?:\/\/\S+$/i.test(form.canonicalUrl.trim())) e.push("Canonical URL must start with http:// or https://.");
    if (form.ogImage.trim() && !/^(https?:\/\/\S+|\/\S*)$/i.test(form.ogImage.trim())) e.push("Social image must be a full URL or a path starting with /.");
    return e;
  }, [form]);

  const previewUrl = `${siteUrl}${form.route === "/" ? "" : form.route}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (errors.length) {
      setAlert({ type: "error", title: "Please fix the highlighted issues", message: errors[0] });
      return;
    }

    setLoading(true);
    setAlert(null);

    const payload = {
      route: form.route,
      title: form.title,
      description: form.description,
      primaryKeyword: form.primaryKeyword,
      secondaryKeywords: form.secondaryKeywords,
      heading: selectedPage?.supportsHeading ? form.heading : "",
      metaRobots: form.metaRobots,
      canonicalUrl: form.canonicalUrl,
      ogImage: form.ogImage,
      status: form.status,
    };

    const result =
      mode === "create"
        ? await createPageSeoAction(payload)
        : await updatePageSeoAction(initialData!.id, payload, initialData!.route);

    setLoading(false);

    if (!result.success) {
      setAlert({ type: "error", title: mode === "create" ? "Could not save" : "Could not update", message: result.error });
      return;
    }

    setAlert({
      type: "success",
      title: mode === "create" ? "SEO entry created" : "SEO entry updated",
      message:
        result.data.status === "published"
          ? `Live on ${result.data.route} from the next page load.`
          : "Saved. Set the status to Published when you want it live.",
    });
    setTimeout(() => router.push("/admin/seo"), 900);
  }

  return (
    <div className="lg:px-8">
      <PageRouteHeader />
      <br />
      <PageTitle
        title={mode === "create" ? "Add Page SEO" : `Edit SEO: ${initialData?.routeLabel ?? ""}`}
        description="Title, description and keywords that search engines read for this page."
      />

      {alert && (
        <div className="py-4">
          <Alert {...alert} onClose={() => setAlert(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: content */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-gray-300">
          <SelectField
            label="Target page"
            value={form.route}
            options={routeOptions}
            disabled={mode === "update"}
            onChange={(e) => setForm({ ...form, route: e.target.value })}
          />
          {mode === "create" && routeOptions.length === 0 && (
            <p className="text-xs text-amber-700">Every managed page already has an entry. Edit an existing one instead.</p>
          )}

          <div className="flex flex-col gap-1">
            <TextField
              label={`SEO title (${form.title.length}/${SEO_LIMITS.TITLE_MAX})`}
              value={form.title}
              placeholder="e.g. Modular Kitchen Designs in Noida | Casa Chic Interior"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={form.title.length > SEO_LIMITS.TITLE_MAX ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-400">Shown as the clickable headline in search results. Aim for 50 to 60 characters.</p>
          </div>

          <TextAreaField
            label="Meta description"
            value={form.description}
            placeholder="One or two sentences that make someone want to click."
            maxLength={SEO_LIMITS.DESCRIPTION_MAX}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <TextField
                label="Primary keyword"
                value={form.primaryKeyword}
                placeholder="e.g. interior designer in noida"
                onChange={(e) => setForm({ ...form, primaryKeyword: e.target.value })}
              />
              <p className="text-xs text-gray-400">The one phrase this page should rank for. Use it naturally in the title and description.</p>
            </div>
            {selectedPage?.supportsHeading && (
              <div className="flex flex-col gap-1">
                <TextField
                  label="Page heading (H1) override"
                  value={form.heading}
                  placeholder="Leave empty to keep the current heading"
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                />
                <p className="text-xs text-gray-400">Replaces the visible main heading on this page only.</p>
              </div>
            )}
          </div>

          <ChipInputField
            label="Secondary keywords"
            name="secondaryKeywords"
            value={form.secondaryKeywords}
            onChange={(values) => setForm({ ...form, secondaryKeywords: values })}
            placeholder="Type a keyword and press Enter"
            helperText={`Related phrases, up to ${SEO_LIMITS.KEYWORDS_MAX_COUNT}. Duplicates of the primary keyword are dropped automatically.`}
          />

          {/* Search preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Search result preview</p>
            <p className="text-xs text-green-700 truncate">{previewUrl}</p>
            <p className="text-lg text-blue-800 leading-snug truncate">
              {form.title || "Title will appear here"}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {form.description || "The meta description will appear here."}
            </p>
          </div>
        </div>

        {/* Right: technical + status */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-300 space-y-4">
            <SelectField
              label="Status"
              value={form.status}
              options={PAGE_SEO_STATUSES.map((s) => ({ label: STATUS_LABELS[s], value: s }))}
              onChange={(e) => setForm({ ...form, status: e.target.value as PageSeoStatus })}
            />

            <SelectField
              label="Search engine directive"
              value={form.metaRobots}
              options={META_ROBOTS_OPTIONS.map((r) => ({ label: r, value: r }))}
              onChange={(e) => setForm({ ...form, metaRobots: e.target.value as MetaRobots })}
            />
            <p className="text-xs text-gray-400 -mt-2">
              Keep &quot;index, follow&quot; for normal pages. &quot;noindex&quot; hides the page from search results.
            </p>

            <div className="flex flex-col gap-1">
              <TextField
                label="Canonical URL override"
                value={form.canonicalUrl}
                placeholder="Leave empty (recommended)"
                onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
              />
              <p className="text-xs text-gray-400">Only needed when this page should credit a different URL. Otherwise it is derived automatically.</p>
            </div>

            <div className="flex flex-col gap-1">
              <TextField
                label="Social share image"
                value={form.ogImage}
                placeholder="/uploads/common/... or https://..."
                onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
              />
              <p className="text-xs text-gray-400">Shown when the page is shared on WhatsApp, Facebook or LinkedIn. Ideal size 1200 x 630.</p>
            </div>
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
              onClick={() => router.push("/admin/seo")}
              className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (mode === "create" && routeOptions.length === 0)}
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
