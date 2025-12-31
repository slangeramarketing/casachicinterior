import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | CasaChic Interior",
  description:
    "Read the terms and conditions governing the use of CasaChic Interior services and website.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-32 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Terms & Conditions
      </h1>

      <p className="text-sm text-gray-500 mb-10">
        Last updated: {new Date().toDateString()}
      </p>

      <section className="space-y-6 text-sm leading-relaxed">
        <p>
          Welcome to <strong>CasaChic Interior</strong>. By accessing or using
          our website and services, you agree to be bound by these Terms &
          Conditions.
        </p>

        <h2 className="text-lg font-semibold">1. Use of Website</h2>
        <p>
          You agree to use this website only for lawful purposes. Any attempt
          to damage, hack, scrape, or misuse the website is strictly prohibited.
        </p>

        <h2 className="text-lg font-semibold">2. Services</h2>
        <p>
          CasaChic Interior provides interior design consultation, ideas, and
          related services. Service details, pricing, and timelines may change
          without prior notice.
        </p>

        <h2 className="text-lg font-semibold">3. Intellectual Property</h2>
        <p>
          All content, designs, images, text, and branding are the intellectual
          property of CasaChic Interior. Unauthorized use is prohibited.
        </p>

        <h2 className="text-lg font-semibold">4. User Information</h2>
        <p>
          Any information you submit must be accurate and truthful. You are
          responsible for the data you provide.
        </p>

        <h2 className="text-lg font-semibold">5. Limitation of Liability</h2>
        <p>
          We are not liable for any direct or indirect damages arising from the
          use of our website or services.
        </p>

        <h2 className="text-lg font-semibold">6. Changes to Terms</h2>
        <p>
          We reserve the right to update these Terms & Conditions at any time.
          Continued use of the website means you accept the updated terms.
        </p>

        <h2 className="text-lg font-semibold">7. Contact</h2>
        <p>
          For any questions, contact us at{" "}
          <strong>support@casachicinterior.com</strong>.
        </p>
      </section>
    </main>
  );
}
