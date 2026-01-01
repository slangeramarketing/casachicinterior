import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CasaChic Interior",
  description:
    "Learn how CasaChic Interior collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-32 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Privacy Policy
      </h1>

      <p className="text-sm text-gray-500 mb-10">
        Last updated: {new Date().toDateString()}
      </p>

      <section className="space-y-6 text-sm leading-relaxed">
        <p>
          CasaChic Interior respects your privacy. This policy explains how we
          collect, use, and protect your information.
        </p>

        <h2 className="text-lg font-semibold">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number (if provided)</li>
          <li>Messages submitted via forms</li>
        </ul>

        <h2 className="text-lg font-semibold">2. How We Use Your Data</h2>
        <p>
          Your data is used only to respond to inquiries, provide services,
          and improve user experience.
        </p>

        <h2 className="text-lg font-semibold">3. Data Security</h2>
        <p>
          We apply reasonable security measures, but no online system is fully
          secure.
        </p>

        <h2 className="text-lg font-semibold">4. Cookies</h2>
        <p>
          Cookies may be used to improve performance and analytics. You can
          disable cookies in your browser settings.
        </p>

        <h2 className="text-lg font-semibold">5. Data Sharing</h2>
        <p>
          We do not sell or rent your personal information. Data is shared only
          when legally required.
        </p>

        <h2 className="text-lg font-semibold">6. Policy Updates</h2>
        <p>
          This policy may be updated periodically. Changes will be reflected on
          this page.
        </p>

        <h2 className="text-lg font-semibold">7. Contact</h2>
        <p>
          For privacy concerns, email{" "}
          <strong>privacy@casachicinterior.com</strong>.
        </p>
      </section>
    </main>
  );
}
