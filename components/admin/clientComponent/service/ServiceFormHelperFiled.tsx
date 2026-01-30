"use client";
import { useState } from "react";
import IconPickerDropDown from "@/components/admin/IconPickerDropDown"; // Path check kar lena
import { getInteriorIconById } from '@/public/assets/constants-icons/interior-icons';

import { ToggleSwitch } from "@/components/common/ToggleSwitch";
import {  FiInstagram,
  FiYoutube,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { TextAreaField, TextField } from "@/components/common/FormField";
import ImagePicker from "@/components/common/ImagePicker";
import { OptimizedImage } from "@/components/common/OptimizedImage";


// Agar aapne ServiceFormState ko kahin define kiya hai to use import karein
// import { ServiceFormState } from "./types"; 

/* =====================================================
    Gallery Manager (V3) - Added Export
===================================================== */
export function GalleryManager({
  newImages,
  existingItems,
  onAdd,
  onUpdateExisting,
  onUpdateNew,
  onRemoveNew,
  onRemoveExisting,
}: {
  newImages: {
    value: File | string;
    alt: string;
    caption: string;
  }[];
  existingItems: {
    url: string;
    alt?: string;
    caption?: string;
  }[];
  onAdd: (item: { value: File | string; alt: string; caption: string }) => void;
  onUpdateExisting: (
    index: number,
    field: "alt" | "caption",
    value: string
  ) => void;
  onUpdateNew: (
    index: number,
    field: "alt" | "caption",
    value: string
  ) => void;
  onRemoveNew: (index: number) => void;
  onRemoveExisting: (url: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ================= EXISTING IMAGES ================= */}
        {existingItems.map((item, idx) => (
          <div
            key={item.url}
            className="w-full h-80 flex flex-col border rounded-lg overflow-hidden bg-white shadow-sm border-green-100"
          >
            <div className="relative aspect-video bg-gray-100">
              <OptimizedImage
                src={item.url}
                alt={item.alt || ""}
                fill
                className="object-cover"
              />
              <button
                onClick={() => onRemoveExisting(item.url)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs"
              >
                ✕
              </button>
              <span className="absolute bottom-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            <div className="p-3 space-y-2 bg-gray-50/50">
              <input
                placeholder="Alt Text"
                className="w-full text-xs border-b outline-none"
                value={item.alt || ""}
                onChange={(e) =>
                  onUpdateExisting(idx, "alt", e.target.value)
                }
              />
              <input
                placeholder="Caption"
                className="w-full text-xs border-b outline-none"
                value={item.caption || ""}
                onChange={(e) =>
                  onUpdateExisting(idx, "caption", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        {/* ================= NEW IMAGES ================= */}
        {newImages.map((item, idx) => {
          const preview =
            item.value instanceof File
              ? URL.createObjectURL(item.value)
              : item.value;

          return (
            <div
              key={idx}
              className="w-full h-80 flex flex-col border rounded-lg overflow-hidden bg-white shadow-sm border-orange-200"
            >
              <div className="relative aspect-video bg-gray-100">
                <OptimizedImage
                  src={preview}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => onRemoveNew(idx)}
                  className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full text-xs"
                >
                  ✕
                </button>
                <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded">
                  New
                </span>
              </div>

              <div className="p-3 space-y-2">
                <input
                  placeholder="Alt Text (SEO)"
                  className="w-full text-xs border-b outline-none"
                  value={item.alt}
                  onChange={(e) =>
                    onUpdateNew(idx, "alt", e.target.value)
                  }
                />
                <input
                  placeholder="Caption"
                  className="w-full text-xs border-b outline-none"
                  value={item.caption}
                  onChange={(e) =>
                    onUpdateNew(idx, "caption", e.target.value)
                  }
                />
              </div>
            </div>
          );
        })}

        {/* ================= ADD IMAGE (ImagePicker) ================= */}
        <div className="w-full h-80 border-2 border-dashed rounded-lg flex items-center justify-center">
          <ImagePicker
            autoOpen={false}
            label=""
            value={null}
            onChange={(val) => {
              if (!val) return;
              onAdd({
                value: val,
                alt: "",
                caption: "",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}


/* =====================================================
    Highlights Manager - Added Export
===================================================== */


export function HighlightsManager({ items, onChange }: { 
  items: { icon: string; title: string }[], 
  onChange: (items: { icon: string; title: string }[]) => void 
}) {
  const [newTitle, setNewTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("check"); // Default ID

  const addHighlight = () => {
    if (!newTitle.trim()) return;
    onChange([...items, { icon: selectedIcon, title: newTitle.trim() }]);
    setNewTitle("");
  };

  return (
    <div className="grid grid-cols-1 space-y-4">
      <label className="text-sm font-semibold text-gray-700">Service Highlights</label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-3 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
        <div className="md:flex-none w-full">
          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Pick Icon</label>
          {/* Aapka Icon Picker Component */}
          <IconPickerDropDown 
            value={selectedIcon} 
            onChange={(id) => setSelectedIcon(id)} 
          />
        </div>
        
        <div className="w-full flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Highlight Title</label>
            <input 
              type="text"
              placeholder="e.g. 15 Years Warranty"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          
          <button 
            type="button"
            onClick={addHighlight}
            className="bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition-colors mt-5 h-8.6"
          >
            Add
          </button>
        </div>
      </div>

      {/* Preview List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        {items.map((h, idx) => {
          const IconComponent = getInteriorIconById(h.icon); // Icon get karna
          return (
            <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-lg shadow-sm group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-md">
                   <IconComponent size={18} />
                </div>
                <span className="text-sm text-gray-800 font-medium">{h.title}</span>
              </div>
              <button 
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="text-gray-400 hover:text-red-500 p-1"
              >✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =====================================================
    FAQs Manager - Added Export
===================================================== */
export function FAQsManager({ items, onChange }: { 
  items: { question: string; answer: string }[], 
  onChange: (items: { question: string; answer: string }[]) => void 
}) {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  const addFaq = () => {
    if (!q.trim() || !a.trim()) return;
    onChange([...items, { question: q.trim(), answer: a.trim() }]);
    setQ("");
    setA("");
  };

  const removeFaq = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };
  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-700">Service FAQs*</label>
      
      {/* Input Box */}
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-3">
        <input 
          placeholder="Enter Question..."
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-orange-500"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <textarea 
          placeholder="Enter Answer..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-orange-500"
          value={a}
          onChange={(e) => setA(e.target.value)}
        />
        <button 
          type="button"
          onClick={addFaq}
          className="w-50 bg-bg-secondary text-black border border-orange-400 border-dashed py-2 rounded  text-sm hover:bg-orange-500 hover:text-white"
        >
          + Add FAQ
        </button>
      </div>

      {/* List Display */}
      <div className="space-y-3">
        {items.map((faq, idx) => (
          <div key={idx} className="p-3 border border-gray-300 rounded-md relative group bg-white shadow-sm">
            <button 
              type="button"
              onClick={() => removeFaq(idx)}
              className="absolute top-2 right-2 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
            <p className="text-sm font-bold text-gray-800 pr-6">Q: {faq.question}</p>
            <p className="text-xs text-gray-600 mt-1 italic">A: {faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================
    Validation Handler - Added Export
===================================================== */
export const validateForm = (data: any, mode: "create" | "update") => {
  const errors: string[] = [];

  // Step 1: Basic Details
  if (!data.title.trim()) errors.push("Title is required (Step 1)");
  if (!data.slug.trim()) errors.push("Slug is required (Step 1)");
  if (!data.categoryId) errors.push("Category is required (Step 1)");

  // Step 2: Content
  if (!data.shortDescription.trim()) errors.push("Short description is required (Step 2)");

  // Step 3: Media
  // Create mode mein cover image zaroori hai, Update mein purani ho sakti hai
  if (mode === "create" && !data.coverImage) {
    errors.push("Cover image is required for new service (Step 3)");
  }

  // Step 4: Highlights & CTA
  if (data.highlights.length === 0) {
    errors.push("At least one highlight is required (Step 4)");
  }
  if (data.startingPrice < 0) {
    errors.push("Starting price cannot be negative (Step 4)");
  }
  if (!data.ctaText.trim()) errors.push("CTA Button text is required (Step 4)");

  // Step 5: SEO
  if (!data.metaTitle.trim()) errors.push("SEO Meta Title is required (Step 5)");

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};


// ==================== Video Manger ======================

export default function VideoManager({ form, setForm }: any) {
  const updateShowcaseField = (field: string, value: any) => {
    setForm({
      ...form,
      videoShowcase: {
        ...form.videoShowcase,
        [field]: value,
      },
    });
  };

  const addItem = (type: "reels" | "youtube") => {
    const newItem =
      type === "reels"
        ? {
            url: "",
            thumbnail: null,
            title: "",
            featured: false,
            order: 0,
          }
        : {
            url:"",
            embedId: "",
            title: "",
            description: "",
            featured: false,
            order: 0,
          };

    setForm({
      ...form,
      videoShowcase: {
        ...form.videoShowcase,
        [type]: [...form.videoShowcase[type], newItem],
      },
    });
  };

  const removeItem = (type: "reels" | "youtube", index: number) => {
    const list = [...form.videoShowcase[type]];
    list.splice(index, 1);

    setForm({
      ...form,
      videoShowcase: { ...form.videoShowcase, [type]: list },
    });
  };

  const updateItem = (
    type: "reels" | "youtube",
    index: number,
    field: string,
    value: any
  ) => {
    const list = [...form.videoShowcase[type]];
    list[index] = { ...list[index], [field]: value };

    setForm({
      ...form,
      videoShowcase: { ...form.videoShowcase, [type]: list },
    });
  };

  return (
    <div className="grid grid-cols-1 space-y-12">

      {/* GLOBAL TOGGLE */}
      <ToggleSwitch
        label="Enable Video Showcase"
        description="Show or hide video section on service page"
        checked={form.videoShowcase.enabled}
        onChange={(v) => updateShowcaseField("enabled", v)}
      />

      {/* =========================
          INSTAGRAM REELS
      ========================= */}
      <div className="grid grid-cols-1 space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="flex items-center gap-2 font-bold text-pink-600">
            <FiInstagram /> Instagram Reels
          </h4>
          <button
            type="button"
            onClick={() => addItem("reels")}
            className="text-xs bg-pink-50 text-pink-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
          >
            <FiPlus /> Add Reel
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {form.videoShowcase.reels.map((reel: any, idx: number) => (
            <div key={idx} className="bg-white border border-gray-300 rounded-xl p-4 space-y-4 relative">
              <button
                onClick={() => removeItem("reels", idx)}
                className="absolute top-2 right-2 text-red-500"
              >
                <FiTrash2 />
              </button>

              <ToggleSwitch
                label="Featured Reel"
                checked={reel.featured}
                onChange={(v) => updateItem("reels", idx, "featured", v)}
                className="mt-4"
              />

              <TextField
                label="Order"
                type="number"
                value={String(reel.order)}
                onChange={(e) =>
                  updateItem("reels", idx, "order", Number(e.target.value))
                }
              />

              <TextField
                label="Instagram Reel URL"
                value={reel.url}
                onChange={(e) =>
                  updateItem("reels", idx, "url", e.target.value)
                }
              />

              {/* ✅ IMAGE UPLOAD FOR INSTAGRAM THUMBNAIL */}
              <ImagePicker
                value={reel.thumbnail || ""}
                onChange={(file) =>
                  updateItem("reels", idx, "thumbnail", file)
                }
              />

              <TextField
                label="Reel Title"
                value={reel.title}
                onChange={(e) =>
                  updateItem("reels", idx, "title", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          YOUTUBE VIDEOS
      ========================= */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="flex items-center gap-2 font-bold text-red-600">
            <FiYoutube /> YouTube Videos
          </h4>
          <button
            type="button"
            onClick={() => addItem("youtube")}
            className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1"
          >
            <FiPlus /> Add Video
          </button>
        </div>

      <div className="grid grid-cols md:grid-cols-2 gap-6">
        {form.videoShowcase.youtube.map((yt: any, idx: number) => (
          <div
            key={idx}
            className="bg-white border border-gray-300 rounded-xl p-4 space-y-4 relative"
          >
            {/* REMOVE BUTTON */}
            <button
              onClick={() => removeItem("youtube", idx)}
              className="absolute top-2 right-2 text-red-500"
            >
              <FiTrash2 />
            </button>

            {/* 🔥 YOUTUBE PREVIEW */}
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black border mt-4 h-50">
              {yt.embedId ? (
                <iframe
                  key={yt.embedId} // important: force refresh when id changes
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${yt.embedId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Paste YouTube URL to preview
                </div>
              )}
            </div>

            {/* FEATURED */}
            <ToggleSwitch
              label="Featured Video"
              checked={yt.featured}
              onChange={(v) => updateItem("youtube", idx, "featured", v)}
            />

            {/* ORDER */}
            <TextField
              label="Order"
              type="number"
              value={String(yt.order)}
              onChange={(e) =>
                updateItem("youtube", idx, "order", Number(e.target.value))
              }
            />

            {/* URL INPUT */}
            <TextField
              label="YouTube Video URL"
              placeholder="https://youtube.com/watch?v=xxxx"
              value={yt.url}
              onChange={(e) => {
                const url = e.target.value;
                updateItem("youtube", idx, "url", url);

                const embedId = extractYoutubeEmbedId(url);
                updateItem("youtube", idx, "embedId", embedId);
              }}
            />


            {/* TITLE */}
            <TextField
              label="Video Title"
              value={yt.title}
              onChange={(e) =>
                updateItem("youtube", idx, "title", e.target.value)
              }
            />

            {/* DESCRIPTION */}
            <TextAreaField
              label="Description"
              value={yt.description}
              maxLength={300}
              onChange={(e) =>
                updateItem("youtube", idx, "description", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      </div>
    </div>
  );
}


function extractYoutubeEmbedId(url: string): string {
  if (!url) return "";

  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(regex);
  return match ? match[1] : "";
}
