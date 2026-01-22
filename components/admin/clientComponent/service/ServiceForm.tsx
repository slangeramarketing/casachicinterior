"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import Alert from "@/components/common/Alert";
import { TextField, TextAreaField, SelectField } from "@/components/common/FormField";
import ImageUpload from "@/components/common/ImageUpload";
import { uploadImage } from "@/lib/uploadImage";
import { ChipInputField } from "@/components/common/ChipInputField";
import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import { CreateServiceDTO, UpdateServiceDTO } from "@/modules/services/service.dto";
import VideoManager, { 
  GalleryManager, 
  HighlightsManager, 
  FAQsManager, 
  validateForm 
} from "@/components/admin/clientComponent/service/ServiceFormHelperFiled"; // Path check kar lena agar folders alag hain
import { createServiceAction, updateServiceAction } from "@/app/actions/service.action";


export interface ServiceFormState {
  title: string;
  slug: string;
  shortDescription: string;
  description: any; // Rich Text editor ka data
  categoryId: string;
  displayOrder: number;
  status: "draft" | "published" | "archived";
  featured: boolean;
  
  // Media handling
  coverImage: File | null;
  newGalleryFiles: { file: File; alt: string; caption: string }[];
  // Interface mein update
  existingGallery: { url: string; alt?: string; caption?: string }[];
  videoShowcase: {
    reels: Array<{ url: string; thumbnail?: string; title?: string }>;
    youtube: Array<{ embedId: string; title?: string; description?: string }>;
  };

  faqs: { question: string; answer: string }[];

  // Pricing & Estimation (YE WALA MISSSING THA)
  startingPrice: number;
  priceUnit: string;
  
  // Lists
  highlights: { icon: string; title: string }[]; 
  
  // SEO (Flattened for easier form binding)
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // Business
  ctaText: string;
  ctaLink: string;
}



/* =====================================================
    Main Form Component
===================================================== */
export default function ServiceForm({ mode, categories, initialData }: any) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);

  const [form, setForm] = useState<ServiceFormState>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    shortDescription: initialData?.shortDescription ?? "",
    description: initialData?.description ?? "",
    categoryId: initialData?.categoryId ?? "",
    displayOrder: initialData?.displayOrder ?? 0,
    status: initialData?.status ?? "draft",
    featured: initialData?.featured ?? false,
    coverImage: null as File | null,
    // Initial State update
    newGalleryFiles: [],
    // Initial state mein update
    existingGallery: initialData?.gallery ?? [],
    videoShowcase: initialData?.videoShowcase || { reels: [], youtube: [] },
    faqs: initialData?.faqs ?? [],
    startingPrice: initialData?.startingPrice ?? 0,
    priceUnit: initialData?.priceUnit ?? "sq ft",
    highlights: initialData?.highlights ?? [],
    metaTitle: initialData?.seo?.title ?? "",
    metaDescription: initialData?.seo?.description ?? "",
    metaKeywords: initialData?.seo?.keywords?.join(", ") ?? "",
    ctaText: initialData?.ctaText ?? "Get Quote",
    ctaLink: initialData?.ctaLink ?? "/contact",
  });

  // Slug Generation
  useEffect(() => {
    if (mode === "create") {
      setForm(f => ({ ...f, slug: f.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }));
    }
  }, [form.title, mode]);

  async function handleSubmit() {
    // 1. Run your existing validation handler
    const validation = validateForm(form, mode);

    if (!validation.isValid) {
      setAlert({ 
        type: "error", 
        title: "Required Fields Missing", 
        message: validation.errors[0] // Pehla error dikhayega
      });
      
      // Auto-jump logic: User ko us step par le jao jahan error hai
      const firstError = validation.errors[0];
      if (firstError.includes("(Step 1)")) setStep(1);
      else if (firstError.includes("(Step 2)")) setStep(2);
      else if (firstError.includes("(Step 3)")) setStep(3);
      else if (firstError.includes("(Step 4)")) setStep(4);
      else if (firstError.includes("(Step 5)")) setStep(5);
      return;
    }

    setLoading(true);
    setProgress(10); 

    try {
      // 2. Upload Cover
      let coverUrl = initialData?.coverImage || "";
      if (form.coverImage) {
        coverUrl = await uploadImage(form.coverImage, "services");
        setProgress(40);
      }

      // 3. Upload new gallery files with metadata
      const newGalleryUrls = await Promise.all(
        form.newGalleryFiles.map(async (item) => {
          const url = await uploadImage(item.file);
          return { 
            url, 
            alt: item.alt || form.title, 
            caption: item.caption 
          };
        })
      );
      setProgress(70);

      // 4. Combine existing items with newly uploaded ones
      const finalGallery = [
        ...form.existingGallery,
        ...newGalleryUrls
      ];

      // 5. Final Payload preparation
      const payloadData = {
        title: form.title,
        slug: form.slug,
        shortDescription: form.shortDescription,
        description: form.description,
        categoryId: form.categoryId,
        displayOrder: Number(form.displayOrder),
        status: form.status,
        featured: form.featured,
        coverImage: coverUrl,
        gallery: finalGallery,
        videoShowcase: {
          reels: form.videoShowcase.reels.map(r => ({
            url: r.url,
            thumbnail: r.thumbnail || "", // Optional: agar thumbnail nahi hai to empty string
            title: r.title
          })),
          youtube: form.videoShowcase.youtube.map(y => ({
            embedId: y.embedId,
            title: y.title,
            description: y.description || ""
          }))
        },
        highlights: form.highlights.map(h => ({ 
          title: h.title, 
          icon: h.icon 
        })),
        faqs: form.faqs, 
        startingPrice: Number(form.startingPrice),
        priceUnit: form.priceUnit,
        ctaText: form.ctaText,
        ctaLink: form.ctaLink,
        seo: {
          title: form.metaTitle,
          description: form.metaDescription,
          keywords: form.metaKeywords.split(",").map(k => k.trim()).filter(Boolean),
          metaRobots: "index, follow"
        }

      };

      console.log("PayloadData: ",payloadData);

      // 6. Execution based on mode
      if (mode === "create") {
        await createServiceAction(payloadData as CreateServiceDTO);
      } else {
        await updateServiceAction(initialData!.id, payloadData as UpdateServiceDTO);
      }

      setProgress(100);
      setAlert({ 
        type: "success", 
        title: "Success", 
        message: `Service ${mode === 'create' ? 'created' : 'updated'} successfully!` 
      });

      setTimeout(() => router.push("/admin/service"), 500);

    } catch (err: any) {
      setAlert({ 
        type: "error", 
        title: "Submission Error", 
        message: err.message || "Failed to save service." 
      });
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }





  return (
    <div className="flex flex-col gap-6 pt-4 pb-18 px-2  lg:px-8 bg-gray-50 min-h-screen">
      <PageRouteHeader />
      <PageTitle title={mode === "create" ? "Add New Service" : "Edit Service"} />

      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      {/* STEP INDICATOR - Simplified for brevity */}
      <div className="flex md:gap-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map(num => (
          <button 
            key={num} 
            onClick={() => setStep(num)} 
            className={`px-2 md:px-4 py-2 rounded-md text-[10px] md:text-xs font-bold transition whitespace-nowrap
              ${step === num ? 'bg-bg-primary text-white' : 'bg-white text-gray-400 border'}`}
          >
            {num === 7 ? "🏁 Review" : `Step ${num}`}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <TextField label="Title*" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <TextField label="Slug" value={form.slug} disabled={mode === "update"} />
            <TextAreaField label="Short Description*" value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} />
            <TextAreaField label="Full Content (Rich Text placeholder)*" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <Nav next={() => setStep(2)} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <SelectField 
                label="Category*" 
                options={categories.map((c: any) => ({ label: c.name, value: c.id }))} 
                value={form.categoryId} 
                onChange={e => setForm({...form, categoryId: e.target.value})} 
            />
            <TextField label="Display Order" type="number" value={String(form.displayOrder)} onChange={e => setForm({...form, displayOrder: Number(e.target.value)})} />
            <SelectField 
                label="Status" 
                options={[{label: 'Draft', value: 'draft'}, {label: 'Published', value: 'published'}]} 
                value={form.status} 
                onChange={e => setForm({...form, status: e.target.value as any})} 
            />
            <ToggleSwitch label="Featured" checked={form.featured} onChange={val => setForm({...form, featured: val})} />
            <Nav back={() => setStep(1)} next={() => setStep(3)} />
          </div>
        )}

        {step === 3 && (
          <div className="w-full space-y-8 animate-in slide-in-from-right duration-500">
            
            {/* 1. COVER IMAGE */}
            <div className="w-full md:p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Primary Branding</h3>
              <ImageUpload 
                label="Cover Image (Primary)*" 
                onChange={(file) => setForm({ ...form, coverImage: file })} 
                wrapperClassName="w-full"
              />
              {!form.coverImage && initialData?.coverImage && (
                <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Current</span>
                  <img 
                    src={initialData.coverImage} 
                    className="w-12 h-12 object-cover rounded-md border shadow-sm" 
                    alt="Current cover"
                  />
                </div>
              )}
            </div>

            {/* 2. GALLERY MANAGER */}
            <div className="w-full p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Photo Gallery (Bento Grid)</h3>
              <GalleryManager 
                newImages={form.newGalleryFiles} 
                existingItems={form.existingGallery}
                onAdd={(files) => {
                  const newItems = files.map(f => ({ file: f, alt: form.title, caption: "" }));
                  setForm({ ...form, newGalleryFiles: [...form.newGalleryFiles, ...newItems] });
                }}
                onUpdateNew={(idx, field, val) => {
                  const updated = [...form.newGalleryFiles];
                  updated[idx] = { ...updated[idx], [field]: val };
                  setForm({ ...form, newGalleryFiles: updated });
                }}
                onUpdateExisting={(idx, field, val) => {
                  const updated = [...form.existingGallery];
                  updated[idx] = { ...updated[idx], [field]: val };
                  setForm({ ...form, existingGallery: updated });
                }}
                onRemoveNew={(idx) => {
                  const updated = [...form.newGalleryFiles];
                  updated.splice(idx, 1);
                  setForm({ ...form, newGalleryFiles: updated });
                }}
                onRemoveExisting={(url) => {
                  setForm({ ...form, existingGallery: form.existingGallery.filter(u => u.url !== url) });
                }}
              />
            </div>

            {/* 3. VIDEO SHOWCASE (NEW 🔥) */}
            <div className="w-full p-6 border border-gray-200 rounded-2xl bg-gray-50/50 shadow-inner">
              <h3 className="text-sm font-bold text-gray-800 mb-6">Social Video Showcase</h3>
              <VideoManager form={form} setForm={setForm} />
            </div>

            {/* NAVIGATION */}
            <div className="flex justify-between items-center pt-6">
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 border rounded-xl hover:bg-gray-100 transition-all text-sm font-medium"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={() => setStep(4)}
                className="px-8 py-2 bg-[#090F1A] text-white rounded-xl hover:bg-black transition-all text-sm font-medium shadow-lg"
              >
                Next: SEO & Pricing
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Highlights Manager */}
            <div className="p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
              <HighlightsManager 
                items={form.highlights} 
                onChange={(vals) => setForm({ ...form, highlights: vals })} 
              />
            </div>

            <hr className="border-gray-100" />

            {/* --- Pricing Section using Custom Components --- */}
            <div className="bg-orange-50/30 p-5 rounded-xl border border-orange-100/50">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-orange-500 text-white p-1 rounded text-[10px]">₹</span>
                Pricing & Estimation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Starting Price Input */}
                <TextField
                  label="Starting Price"
                  name="startingPrice"
                  type="number"
                  placeholder="e.g. 1500"
                  value={form.startingPrice.toString()}
                  onChange={(e) => setForm({ ...form, startingPrice: Number(e.target.value) })}
                  className="focus:ring-orange-500" // Custom orange focus to match theme
                  labelClassName="text-[11px] uppercase tracking-wider text-gray-500"
                />

                {/* Price Unit Dropdown */}
                <SelectField
                  label="Price Unit"
                  name="priceUnit"
                  value={form.priceUnit}
                  onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
                  className="focus:ring-orange-500"
                  labelClassName="text-[11px] uppercase tracking-wider text-gray-500"
                  options={[
                    { label: "per Sq. Ft", value: "sq ft" },
                    { label: "per Sq. Meter", value: "sq m" },
                    { label: "per Unit", value: "unit" },
                    { label: "per Room", value: "room" },
                    { label: "Fixed Price", value: "fixed" },
                  ]}
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* CTA Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField 
                label="CTA Button Text" 
                placeholder="e.g. Get Free Quote"
                value={form.ctaText} 
                onChange={e => setForm({...form, ctaText: e.target.value})} 
              />
              <TextField 
                label="CTA Link" 
                placeholder="e.g. /contact"
                value={form.ctaLink} 
                onChange={e => setForm({...form, ctaLink: e.target.value})} 
              />
            </div>

            <Nav back={() => setStep(3)} next={() => setStep(5)} />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <TextField label="Meta Title*" value={form.metaTitle} onChange={e => setForm({...form, metaTitle: e.target.value})} />
            <TextField label="Meta Description*" value={form.metaDescription} onChange={e => setForm({...form, metaDescription: e.target.value})} />
            
            {/* Using ChipInput for Meta Keywords */}
            <ChipInputField 
              label="Meta Keywords" 
              name="metaKeywords"
              value={form.metaKeywords ? form.metaKeywords.split(",").map(k => k.trim()) : []} 
              onChange={(chips) => setForm({...form, metaKeywords: chips.join(", ")})}
              placeholder="Type keyword and press enter"
            />
            
            <Nav back={() => setStep(4)} next={() => setStep(6)} />
          </div>
        )}

        {/* STEP 6: FAQs */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
              <p className="text-sm text-orange-500">💡 <b>SEO Tip:</b> Add at least 3-4 frequently asked questions to rank better on Google.</p>
            </div>
            
            <FAQsManager 
              items={form.faqs} 
              onChange={(vals) => setForm({ ...form, faqs: vals })} 
            />

            <Nav back={() => setStep(5)} next={() => setStep(7)} />
          </div>
        )}

        {/* STEP 7: FINAL REVIEW & SUBMIT */}
        {step === 7 && (
          <div className="text-center py-10 animate-in zoom-in-95 duration-300">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.59 14.37a6 6 0 01-5.84 0M4.79 14c-.52.08-1.07.24-1.58.48a.5.5 0 00-.21.69L5.41 19.3a.5.5 0 00.69.21c.51-.24 1.06-.4 1.58-.48m11.53-5.11c.52.08 1.07.24 1.58.48a.5.5 0 01.21.69l-2.41 4.13a.5.5 0 01-.69.21c-.51-.24-1.06-.4-1.58-.48M10 7l2-2 2 2M12 5v9m-4 5h8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Ready to Publish?</h3>
              <p className="text-gray-500">Please review all steps. Once you click save, images will be optimized and uploaded.</p>
            </div>

            {loading && (
              <div className="mb-6 max-w-md mx-auto">
                <div className="flex justify-between text-xs mb-1">
                  <span>Processing Assets...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                  <div className="bg-green-500 h-full transition-all duration-300" style={{width: `${progress}%`}}></div>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button 
                type="button"
                onClick={() => setStep(6)} 
                className="px-6 py-2 border rounded hover:bg-gray-50 transition"
              >
                Back to FAQs
              </button>
              <button 
                type="button"
                onClick={handleSubmit} 
                disabled={loading} 
                className={`px-10 py-2 rounded font-bold text-white transition-all
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-200'}`}
              >
                {loading ? `Uploading...` : "Save & Publish Service"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Nav({ next, back }: any) {
  return (
    <div className="flex justify-between pt-6 border-t mt-6">
      {back ? <button onClick={back} className="px-4 py-2 text-gray-400">← Previous</button> : <div></div>}
      {next && <button onClick={next} className="px-6 py-2 bg-green-500 text-white rounded">Continue</button>}
    </div>
  );
}