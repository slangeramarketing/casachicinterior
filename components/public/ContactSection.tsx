"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const res = await fetch("/send-mail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(form).toString(),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        alert("Thank you! We will contact you soon.");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    };

  return (
    <section className="w-full py-24 bg-white" id="contact">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-20">
          <p className="text-xs lg:text-sm text-gray-500 mb-2">Get in touch</p>
          <h2 className="text-2xl lg:text-3xl md:text-4xl font-bold text-gray-900">
            Let’s Design Your Dream Space
          </h2>
          <p className="mt-3 text-xs lg:text-sm md:text-base text-gray-600">
            Submit your query and our team will reach out shortly.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 lg:p-8 p-4 mt-12">

          {/* CONTACT INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-[-50px] mb-14">
            <ContactInfo
              icon={<FiMail />}
              title="Email"
              value="help@casachic.com"
            />
            <ContactInfo
              icon={<FiPhone />}
              title="Phone"
              value="+91 9123456789"
            />
            <ContactInfo
              icon={<FiMapPin />}
              title="Location"
              value="Delhi NCR, Noida"
            />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-orange-500"

              />
              <input
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <input
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              required
              type="tel"
              placeholder="Phone No"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
            />

            <textarea
              name="message" 
              value={form.message} 
              onChange={handleChange} 
              required
              placeholder="Message"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-500"
            />

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md transition"
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}

/* -------------------------------
   CONTACT INFO CARD
-------------------------------- */
function ContactInfo({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-2 py-3 lg:p-4 border border-gray-200">
      <div className="w-7 h-7 lg:w-12 lg:h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-xl">
        {icon}
      </div>
      <div>
        <p className="text-xs lg:text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs lg:text-sm text-gray-600">{value}</p>
      </div>
    </div>
  );
}
