"use client";

import { FiMail, FiPhone, FiMapPin, FiSend, FiLoader, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import cities from "@/lib/data/indian-cities.json";
import { useState } from "react";
import { submitContactAction } from "@/app/(public)/actions/public.message.action";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    customCity: "",
    message: "",
  });

  const [status, setStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false,
  });

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    const finalCity = form.city === "Other" ? form.customCity : form.city;

    if (!form.name || !form.email || !form.phone || !finalCity || !form.message) {
      setStatus({ loading: false, error: "Please fill all required fields.", success: false });
      return;
    }

    try {
      await submitContactAction({
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: finalCity,
        message: form.message,
      });

      setForm({ name: "", email: "", phone: "", city: "", customCity: "", message: "" });
      setStatus({ loading: false, error: null, success: true });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus(s => ({ ...s, success: false })), 5000);
    } catch (err) {
      setStatus({ loading: false, error: "Something went wrong. Please try again.", success: false });
    }
  };

  return (
    <section className="w-full py-34 bg-[#F2F2F2] overflow-hidden" id="contact">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* HEADER - Slide Up Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#F97316] font-bold tracking-widest text-xs uppercase bg-[#F97316]/10 px-4 py-1.5 rounded-full">
            Connect With Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#090F1A] mt-4">
            Let’s Design Your <span className="text-[#F97316]">Dream Space</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Ready to transform your home? Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT: CONTACT INFO - Premium Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <ContactInfo icon={<FiMail />} title="Email Us" value="contact@casachicinterior.com" href="mailto:contact@casachicinterior.com" />
            <ContactInfo icon={<FiPhone />} title="Call Us" value="+91 9123456789" href="tel:+919123456789" />
            <ContactInfo icon={<FiMapPin />} title="Visit Us" value="Delhi NCR, Noida Sector 62" />
            
            {/* Design Element */}
            <div className="hidden lg:block p-8 bg-[#0c1f43] rounded mt-10 relative overflow-hidden text-white">
              <p className="text-xl font-medium relative z-10">"Design is not just what it looks like, it's how it works."</p>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#F97316] rounded-full blur-3xl opacity-30" />
            </div>
          </motion.div>

          {/* RIGHT: THE FORM - Clean Elevated Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded shadow-2xl shadow-black/5 p-8 md:p-12 relative"
          >
            {/* Status Messages with AnimatePresence */}
            <AnimatePresence mode="wait">
              {status.error && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 text-red-700 text-sm flex items-center gap-3">
                  <span>{status.error}</span>
                </motion.div>
              )}
              {status.success && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 text-green-800 text-sm flex items-center gap-3">
                  <FiCheckCircle className="flex-shrink-0" />
                  <span>Thank you! Your vision is one step closer to reality.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#090F1A] uppercase tracking-wider ml-1">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={updateField} placeholder="John Doe" 
                  className="w-full bg-[#F2F2F2] border-none rounded-md px-5 py-3 text-sm focus:ring-2 focus:ring-[#F97316] transition-all outline-none" required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#090F1A] uppercase tracking-wider ml-1">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={updateField} placeholder="john@example.com"
                  className="w-full bg-[#F2F2F2] border-none rounded-md px-5 py-3 text-sm focus:ring-2 focus:ring-[#F97316] transition-all outline-none" required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-[#090F1A] uppercase tracking-wider ml-1">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={updateField} placeholder="+91 XXXXX XXXXX"
                  className="w-full bg-[#F2F2F2] border-none rounded-md px-5 py-3 text-sm focus:ring-2 focus:ring-[#F97316] transition-all outline-none" required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-[#090F1A] uppercase tracking-wider ml-1">Location</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select name="city" value={form.city} onChange={updateField}
                    className="w-full bg-[#F2F2F2] border-none rounded-md px-5 py-3 text-sm focus:ring-2 focus:ring-[#F97316] transition-all outline-none appearance-none" required >
                    <option value="" disabled>Select City</option>
                    {cities.map((cityName) => (<option key={cityName} value={cityName}>{cityName}</option>))}
                  </select>
                  {form.city === "Other" && (
                    <motion.input initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      type="text" name="customCity" value={form.customCity} onChange={updateField} placeholder="Enter city name"
                      className="w-full bg-[#F2F2F2] border-none rounded-md px-5 py-3 text-sm focus:ring-2 focus:ring-[#F97316] transition-all outline-none" required />
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-[#090F1A] uppercase tracking-wider ml-1">Message</label>
                <textarea name="message" value={form.message} onChange={updateField} placeholder="Tell us about your space..." rows={4}
                  className="w-full bg-[#F2F2F2] border-none rounded-md px-5 py-3 text-sm focus:ring-2 focus:ring-[#F97316] transition-all outline-none resize-none" required />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="md:col-span-2 w-full bg-[#F97316] text-white font-bold py-3 rounded-md shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:bg-orange-300"
              >
                {status.loading ? <FiLoader className="animate-spin" /> : <FiSend />}
                {status.loading ? "Processing..." : "Submit Inquiry"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: string; href?: string }) {
  const Content = (
    <div className="flex items-center gap-5 p-6 bg-white rounded-md border border-gray-100 hover:border-[#F97316]/30 transition-all group">
      <div className="w-12 h-12 rounded-md bg-[#F97316]/10 flex items-center justify-center text-[#F97316] text-xl group-hover:bg-[#F97316] group-hover:text-white transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{title}</p>
        <p className="text-sm font-bold text-[#090F1A]">{value}</p>
      </div>
    </div>
  );

  return href ? <a href={href} className="block">{Content}</a> : Content;
}