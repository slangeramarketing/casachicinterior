"use client";

import { useState } from "react";
import { GeneratedServiceData } from "@/modules/ai-content/ai.schema";

interface AiServiceGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: GeneratedServiceData) => void;
  categories: any[];
}

export default function AiServiceGeneratorModal({
  isOpen,
  onClose,
  onConfirm,
  categories,
}: AiServiceGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<GeneratedServiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/services/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: prompt,
          categories: categories.map(c => ({ id: c.id, name: c.name, description: c.description || "" }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      const data = await response.json();
      setPreviewData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    // We can just call generate again since LLMs will give slightly different output 
    // or we can append "make it different" to the prompt invisibly if we wanted.
    handleGenerate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>✨</span> Create Service Using AI
            </h2>
            <p className="text-sm text-gray-500">Describe the service and AI will generate complete structured content.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          
          {/* Left Column: Input */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <label className="text-sm font-bold text-gray-700">What do you want to create?</label>
            <textarea
              className="w-full h-64 p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none"
              placeholder="Example: Create a Luxury Modular Kitchen service. Target audience: Premium homeowners. Style: Modern. Include Pricing and SEO..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={2000}
              disabled={loading}
            ></textarea>
            <div className="text-xs text-gray-400 text-right">{prompt.length}/2000</div>
            
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}

            {!previewData && (
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all"
              >
                {loading ? "Generating Service..." : "Generate Draft"}
              </button>
            )}
          </div>

          {/* Right Column: Preview / Loading */}
          <div className="w-full md:w-2/3 border-l pl-0 md:pl-6">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">Generating Service... This may take 10-15 seconds.</p>
              </div>
            )}

            {!loading && !previewData && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20 text-center">
                <span className="text-4xl mb-3">🪄</span>
                <p>Waiting for prompt...</p>
              </div>
            )}

            {!loading && previewData && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-xl font-extrabold text-gray-800">Generated Service</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Ready to Use
                  </span>
                </div>
                
                {/* Basic Info Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="text-orange-500">📑</span> Basic Info
                    </h4>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{previewData.title}</h1>
                  <div className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded inline-block mb-4 border border-blue-100">
                    /{previewData.slug}
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-4 italic border-l-2 border-gray-200 pl-3">
                    "{previewData.shortDescription}"
                  </p>
                  
                  <div className="text-sm text-gray-700 bg-gray-50/50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                    {previewData.description}
                  </div>
                </div>

                {/* Grid Layout for Meta & Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category & Pricing */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1">
                        <span className="text-green-500">💰</span> Pricing & Category
                      </h4>
                      
                      <div className="mb-4">
                        <span className="text-xs text-gray-500 block mb-1">Starting Price</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {previewData.startingPrice ? `₹${previewData.startingPrice.toLocaleString()}` : "Custom"}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 uppercase">/ {previewData.priceUnit}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50">
                      <span className="text-xs text-gray-500 block mb-1">Suggested Category</span>
                      <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-purple-100">
                        📁 {categories.find(c => c.id === previewData.categorySuggestion)?.name || "Uncategorized"}
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bento */}
                  <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <span className="text-yellow-500">✨</span> Highlights
                      </h4>
                      <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border">{previewData.highlights.length} Items</span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {previewData.highlights.slice(0, 4).map((h, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-50 shadow-sm">
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 text-xs font-bold flex-shrink-0">
                            ✓
                          </div>
                          <span className="text-sm font-semibold text-gray-700 line-clamp-1">{h.title}</span>
                        </div>
                      ))}
                      {previewData.highlights.length > 4 && (
                        <div className="text-center pt-2">
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            +{previewData.highlights.length - 4} more highlights
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* FAQs Card */}
                {previewData.faqs && previewData.faqs.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <span className="text-purple-500">❓</span> Frequently Asked Questions
                      </h4>
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border">{previewData.faqs.length} Items</span>
                    </div>
                    
                    <div className="space-y-3">
                      {previewData.faqs.map((faq, i) => (
                        <div key={i} className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                          <h5 className="text-sm font-bold text-gray-800 mb-1.5 flex items-start gap-2">
                            <span className="text-orange-500 font-black">Q.</span>
                            {faq.question}
                          </h5>
                          <p className="text-sm text-gray-600 pl-6 border-l-2 border-gray-200 ml-1.5 py-0.5">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SEO Card */}
                <div className="bg-white p-0 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-blue-50/50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="text-blue-500">🔍</span>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Search Engine Preview</h4>
                  </div>
                  <div className="p-5">
                    <div className="text-[18px] text-[#1a0dab] font-medium leading-tight hover:underline cursor-pointer mb-1 line-clamp-1">
                      {previewData.seo.title}
                    </div>
                    <div className="text-[13px] text-[#006621] mb-1.5 flex items-center gap-1">
                      <span>casachicinterior.com</span>
                      <span className="text-gray-400">›</span>
                      <span>services</span>
                      <span className="text-gray-400">›</span>
                      <span>{previewData.slug}</span>
                    </div>
                    <div className="text-[13px] text-[#545454] leading-snug line-clamp-2 mb-4">
                      {previewData.seo.description}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase mr-1 mt-0.5">Keywords:</span>
                      {previewData.seo.keywords.map((k, i) => (
                        <span key={i} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium hover:bg-gray-200 transition-colors">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-xl transition">
            Cancel
          </button>
          
          {previewData && !loading && (
            <div className="flex gap-3">
              <button 
                onClick={handleRegenerate}
                className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition"
              >
                Generate Another
              </button>
              <button 
                onClick={() => onConfirm(previewData)}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transition"
              >
                Use This Version
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
