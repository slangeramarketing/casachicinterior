import ClientLayout from "./ClientLayout";
import ContactIcons from "@/components/public/layouts/ContactIcons";

/**
 * Public site layout. The <html>/<body> shell, fonts and analytics live
 * in the root layout (app/layout.tsx); rendering them here as well
 * produced nested <html> and <body> tags in the served HTML.
 *
 * Every public page is rendered on demand so dashboard changes
 * (content and SEO) are live on the next request.
 */
export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClientLayout>{children}</ClientLayout>
      <ContactIcons />
    </>
  );
}
