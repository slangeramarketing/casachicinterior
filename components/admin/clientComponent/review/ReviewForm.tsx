"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLink, FiArrowLeft, FiCopy, FiCheck, FiLoader, FiUser, FiMail, FiLayers } from "react-icons/fi";
import Alert, { AlertType } from "@/components/common/Alert";
import { ReviewUIApp } from "@/app/actions/review.action";

export default function ReviewForm() {
  const router = useRouter();
  
  // States
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    serviceId: "", // Actual ID from your services table/data
  });

const handleGenerate = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setAlert(null);
  
  try {
    const res = await ReviewUIApp.generateToken({
      clientEmail: formData.clientEmail,
      clientName: formData.clientName,
      serviceId: formData.serviceId,
    });

    // TypeScript Fix: Check if success is true AND data exists
    if (res?.success && res.data?.token) {
      const link = `${window.location.origin}/review/submit/${res.data.token}`;
      setGeneratedLink(link);
      setAlert({
        type: "success",
        title: "Token Created",
        message: "The review link has been saved to the database.",
      });
    } else {
      // Agar success false hai ya data/token missing hai
      throw new Error(res?.message || "Failed to receive token from server.");
    }
  } catch (err: any) {
    setAlert({
      type: "error",
      title: "Action Error",
      message: err.message || "Something went wrong.",
    });
  } finally {
    setLoading(false);
  }
};

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between px-2">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-all text-sm font-semibold"
        >
          <FiArrowLeft /> Back to List
        </button>
        <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Link Generator</h2>
      </div>

      {alert && <div className="w-full"><Alert {...alert} onClose={() => setAlert(null)} /></div>}

      <form onSubmit={handleGenerate} className="bg-white border border-gray-200 rounded-[2rem] shadow-xl shadow-gray-100 overflow-hidden">
        <div className="p-8 lg:p-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Client Name */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                <FiUser className="text-[#F97316]" /> Client Name
              </label>
              <input
                required
                type="text"
                placeholder="Aman Shrivastav"
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#F97316] outline-none transition-all font-medium text-gray-700"
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>

            {/* Client Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                <FiMail className="text-[#F97316]" /> Email Address
              </label>
              <input
                required
                type="email"
                placeholder="aman@example.com"
                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#F97316] outline-none transition-all font-medium text-gray-700"
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              />
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
              <FiLayers className="text-[#F97316]" /> Select Service
            </label>
            <select
              required
              className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#F97316] outline-none transition-all font-semibold text-gray-700 appearance-none cursor-pointer"
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
            >
              <option value="">Choose a service...</option>
              <option value="service_modular_kitchen">Modular Kitchen</option>
              <option value="service_wardrobe">Wardrobe Design</option>
              <option value="service_full_home">Full Home Renovation</option>
            </select>
          </div>

          {/* Action Button or Result Link */}
          {!generatedLink ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#F97316] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#ea580c] transition-all disabled:opacity-50 shadow-lg shadow-orange-200 active:scale-[0.98]"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiLink size={20} />}
              {loading ? "SAVING TO DATABASE..." : "GENERATE SECURE LINK"}
            </button>
          ) : (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="p-6 bg-orange-50 border-2 border-dashed border-orange-200 rounded-3xl space-y-4">
                <p className="text-xs font-black text-[#F97316] uppercase text-center tracking-widest">Link is ready for client!</p>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={generatedLink} 
                    className="flex-1 bg-white border border-orange-100 px-4 py-3 rounded-xl text-xs font-mono text-gray-600 outline-none" 
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-5 bg-white border border-orange-200 text-[#F97316] rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                  >
                    {copied ? <FiCheck className="text-green-500 scale-125" /> : <FiCopy />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter italic">
            Architecture Secure: UI → Action → Server → Service → DB
          </p>
        </div>
      </form>
    </div>
  );
}