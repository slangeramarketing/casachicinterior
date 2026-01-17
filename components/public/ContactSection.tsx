"use client";

import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import cities from "@/lib/data/indian-cities.json";
import { useState } from "react";
import { submitContactAction } from "@/app/(public)/actions/public.message.action";


export default function ContactSection() {
  const [city, setCity] = useState<string>("");
  const [customCity, setCustomCity] = useState<string>("");
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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  /*****************************
       Form Action Handler 
   ******************************/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus({ loading: true, error: null, success: false });

    const finalCity =
      form.city === "Other" ? form.customCity : form.city;

    // Basic client-side validation (UX only)
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !finalCity ||
      !form.message
    ) {
      setStatus({
        loading: false,
        error: "Please fill all required fields.",
        success: false,
      });
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

      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        customCity: "",
        message: "",
      });

      setStatus({
        loading: false,
        error: null,
        success: true,
      });
    } catch (err) {
      setStatus({
        loading: false,
        error: "Something went wrong. Please try again.",
        success: false,
      });
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
              value="contact@casachicinterior.com"
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

          <div className="w-full flex justify-center items-center">
            {/* STATUS MESSAGE */}
            {status.error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2 mb-6 w-full">
                {status.error}
              </p>
            )}

            {status.success && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2 mb-6 w-full">
                Thank you! Your message has been sent successfully.
              </p>
            )}
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 mb-8 lg:px-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={updateField}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={updateField}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone No"
              value={form.phone}
              onChange={updateField}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
              required
            />

            {/* CITY DROPDOWN */}
            <div className="space-y-3">
              <select
                name="city"
                value={form.city}
                onChange={(e) => {
                  updateField(e);
                  if (e.target.value !== "Other") {
                    setForm((prev) => ({
                      ...prev,
                      customCity: "",
                    }));
                  }
                }}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm bg-white focus:outline-none focus:border-orange-500"
                required
              >
                <option value="" disabled>
                  Select City
                </option>

                {cities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>

              {/* SHOW ONLY WHEN OTHER */}
              {form.city === "Other" && (
                <input
                  type="text"
                  name="customCity"
                  placeholder="Enter your city"
                  value={form.customCity}
                  onChange={updateField}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                  required
                />
              )}
            </div>

            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              value={form.message}
              onChange={updateField}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-500"
              required
            />

            <button
              type="submit"
              disabled={status.loading}
              className={`w-full font-semibold py-3 rounded-md transition
                ${
                  status.loading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
            >
              {status.loading ? "Submitting..." : "Submit"}
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
