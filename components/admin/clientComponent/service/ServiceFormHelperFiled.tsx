"use client";
import { useState } from "react";
import IconPickerDropDown from "@/components/admin/IconPickerDropDown"; // Path check kar lena
import { getInteriorIconById } from '@/public/assets/constants-icons/interior-icons';
import { FiInstagram, FiYoutube, FiPlus, FiTrash2, FiExternalLink } from "react-icons/fi";
import Image from "next/image";
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
  onRemoveExisting 
}: { 
  newImages: { file: File; alt: string; caption: string }[], 
  existingItems: { url: string; alt?: string; caption?: string }[], 
  onAdd: (files: File[]) => void, 
  onUpdateExisting: (index: number, field: 'alt' | 'caption', value: string) => void,
  onUpdateNew: (index: number, field: 'alt' | 'caption', value: string) => void,
  onRemoveNew: (index: number) => void,
  onRemoveExisting: (url: string) => void 
}) {
    return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6">
        
        {/* --- 1. EXISTING IMAGES --- */}
        {existingItems.map((item, idx) => (
          <div key={item.url} className="w-80 h-80 flex flex-col border rounded-lg overflow-hidden bg-white shadow-sm border-green-100">
            <div className="relative aspect-video bg-gray-100">
              <img src={item.url} className="object-cover w-full h-full" />
              <button onClick={() => onRemoveExisting(item.url)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg text-xs">✕</button>
              <span className="absolute bottom-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded shadow">Live</span>
            </div>
            <div className="p-3 space-y-2 bg-gray-50/50">
              <input 
                placeholder="Alt Text"
                className="w-full text-xs border-b border-gray-200 bg-transparent outline-none focus:border-orange-500 p-1"
                value={item.alt || ""}
                onChange={(e) => onUpdateExisting(idx, 'alt', e.target.value)}
              />
              <input 
                placeholder="Caption"
                className="w-full text-xs border-b border-gray-200 bg-transparent outline-none focus:border-orange-500 p-1"
                value={item.caption || ""}
                onChange={(e) => onUpdateExisting(idx, 'caption', e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* --- 2. NEW SELECTED IMAGES (With Inputs) --- */}
        {newImages.map((item, idx) => (
          <div key={idx} className="w-80 h-80 flex flex-col border rounded-lg overflow-hidden bg-white shadow-sm border-orange-200 ring-1 ring-orange-100">
            <div className="relative aspect-video bg-gray-100">
              <img src={URL.createObjectURL(item.file)} className="object-cover w-full h-full" />
              <button onClick={() => onRemoveNew(idx)} className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full shadow-lg text-xs">✕</button>
              <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded shadow">New</span>
            </div>
            <div className="p-3 space-y-2">
              <input 
                placeholder="Alt Text (SEO)"
                className="w-full text-xs border-b border-gray-200 outline-none focus:border-orange-500 p-1"
                value={item.alt}
                onChange={(e) => onUpdateNew(idx, 'alt', e.target.value)}
              />
              <input 
                placeholder="Add Caption..."
                className="w-full text-xs border-b border-gray-200 outline-none focus:border-orange-500 p-1"
                value={item.caption}
                onChange={(e) => onUpdateNew(idx, 'caption', e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* --- 3. ADD BUTTON --- */}
        <label className="w-80 h-80 aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-all group">
          <span className="text-3xl text-gray-400 group-hover:text-orange-500 group-hover:scale-110 transition-transform">+</span>
          <span className="text-xs font-semibold text-gray-500 group-hover:text-orange-500">Upload Images</span>
          <input 
            type="file" 
            multiple 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files) onAdd(Array.from(e.target.files));
              e.target.value = ""; // Clear for same file re-upload
            }} 
          />
        </label>
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
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-700">Service Highlights</label>
      
      <div className="md:flex md:flex-col grid grid-cols-2 items-end gap-3 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
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
            className="bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-orange-600 transition-colors h-[44px]"
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



// =================== Vide Mangar ========================

export default function VideoManager({ form, setForm }: any) {
  
  // Add New Item Logic
  const addVideo = (type: "reels" | "youtube") => {
    const newItem = type === "reels" 
      ? { url: "", thumbnail: "", title: "" } 
      : { embedId: "", title: "", description: "" };
    
    setForm({
      ...form,
      videoShowcase: {
        ...form.videoShowcase,
        [type]: [...form.videoShowcase[type], newItem]
      }
    });
  };

  // Remove Item Logic
  const removeVideo = (type: "reels" | "youtube", index: number) => {
    const updatedList = [...form.videoShowcase[type]];
    updatedList.splice(index, 1);
    setForm({
      ...form,
      videoShowcase: { ...form.videoShowcase, [type]: updatedList }
    });
  };

  // Update Field Logic
  const updateVideo = (type: "reels" | "youtube", index: number, field: string, value: string) => {
    const updatedList = [...form.videoShowcase[type]];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setForm({
      ...form,
      videoShowcase: { ...form.videoShowcase, [type]: updatedList }
    });
  };

  return (
    <div className="space-y-10">
      
      {/* --- INSTAGRAM REELS SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 font-bold text-pink-600">
            <FiInstagram size={20} /> <span>Instagram Reels</span>
          </div>
          <button type="button" onClick={() => addVideo("reels")} 
            className="text-xs bg-pink-50 text-pink-600 px-3 py-1.5 rounded-lg font-bold hover:bg-pink-100 transition-all flex items-center gap-1">
            <FiPlus /> Add Reel
          </button>
        </div>

        {/* Horizontal Scroll for Reels */}
        <div className="w-full flex flex-wrap gap-4 pb-6">
          {form.videoShowcase.reels.map((reel: any, idx: number) => (
            <div key={idx} className="w-full lg:w-40 bg-white rounded-2xl shadow-sm relative group">
              <button onClick={() => removeVideo("reels", idx)} className="absolute -top-0 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg transition-all z-10">
                <FiTrash2 size={14} />
              </button>
              
              <div className="space-y-3">
                <div className="relative w-40 mx-auto overflow-hidden rounded-2xl bg-gray-50 shadow-sm aspect-[9/16]">
                  {reel.url ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Iframe ko scale up (zoom) kar rahe hain aur position adjust kar rahe hain 
                          taki Follow button aur footer cut jaye 
                      */}
                      <iframe
                        src={`${getInstagramEmbedUrl(reel.url)}?utm_source=ig_web_copy_link`}
                        className="absolute w-[120%] h-[150%] max-w-none border-none pointer-events-none"
                        style={{
                          top: "-25%", // Header/Follow button ko upar dhakelne ke liye
                          left: "-10%",
                        }}
                        scrolling="no"
                        allowTransparency={true}
                        title="Instagram Reel Preview"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <FiInstagram className="text-gray-300" size={32} />
                      <span className="text-[10px] text-gray-400 font-medium">No Preview</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <input type="text" placeholder="Reel URL (e.g. https://...)" value={reel.url} onChange={(e) => updateVideo("reels", idx, "url", e.target.value)}
                  className="w-full p-2 text-xs border-gray-200 rounded bg-gray-50 focus:ring-pink-500 focus:border-pink-500" />
                  <input type="text" placeholder="Title (e.g. Modern Kitchen)" value={reel.title} onChange={(e) => updateVideo("reels", idx, "title", e.target.value)}
                    className="w-full text-xs border-gray-200 focus:ring-pink-500 focus:border-pink-500 p-2 rounded bg-gray-50 " />
                </div>
              </div>
            </div>
          ))}
          {form.videoShowcase.reels.length === 0 && <p className="text-xs text-gray-400 italic">No reels added yet.</p>}
        </div>
      </div>

      {/* --- YOUTUBE VIDEOS SECTION --- */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 font-bold text-red-600">
            <FiYoutube size={20} /> <span>YouTube Projects</span>
          </div>
          <button type="button" onClick={() => addVideo("youtube")}
            className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition-all flex items-center gap-1">
            <FiPlus /> Add Video
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {form.videoShowcase.youtube.map((yt: any, idx: number) => (
            <div key={idx} className="min-w-[320px] bg-white border border-gray-300 rounded-2xl p-4 shadow-sm relative group">
              <button onClick={() => removeVideo("youtube", idx)} className="absolute -top-0 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg  transition-all z-10">
                <FiTrash2 size={14} />
              </button>

              <div className="space-y-3">
                <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center border">
                  {yt.embedId ? (
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${yt.embedId}`} />
                  ) : (
                    <FiYoutube className="text-gray-700" size={40} />
                  )}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="YouTube Video ID (dQw4w9WgXcQ)" value={yt.embedId} onChange={(e) => updateVideo("youtube", idx, "embedId", e.target.value)}
                    className="w-full text-xs border-gray-200 p-2 rounded bg-gray-50 focus:ring-red-500 focus:border-red-500" />
                </div>
                <input type="text" placeholder="Video Title" value={yt.title} onChange={(e) => updateVideo("youtube", idx, "title", e.target.value)}
                  className="w-full text-xs border-gray-200 p-2 rounded bg-gray-50" />
              </div>
            </div>
          ))}
          {form.videoShowcase.youtube.length === 0 && <p className="text-xs text-gray-400 italic">No YouTube videos added yet.</p>}
        </div>
      </div>

    </div>
  );
}


/**
 * Instagram URL se thumbnail URL generate karne ka function
 * @param url - Instagram reel ya post ki original link
 * @returns Thumbnail image ki string ya null
 */
const getInstagramThumbnail = (url: string | undefined | null): string | null => {
  if (!url || typeof url !== 'string') return null;

  try {
    // URL ke query parameters hatane ke liye split ka use
    const baseUrl: string = url.split("?")[0]; 
    
    // Check karna ki trailing slash hai ya nahi aur endpoint add karna
    const cleanUrl: string = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    
    return `${cleanUrl}media/?size=m`;
  } catch (error) {
    console.error("Invalid URL provided to getInstagramThumbnail");
    return null;
  }
};


/**
 * Instagram URL ko embed format mein convert karne ka function
 */
const getInstagramEmbedUrl = (url: string | undefined | null): string | null => {
  if (!url || typeof url !== 'string') return null;

  try {
    // Query params hata kar clean URL nikalna
    const baseUrl = url.split("?")[0];
    // Embed path add karna
    const cleanUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return `${cleanUrl}embed`;
  } catch (error) {
    return null;
  }
};