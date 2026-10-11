import NextTopLoader from "nextjs-toploader";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleTagManager from "@/lib/GoogleTagManager";
import { Metadata } from "next";
import { siteConfig } from "@/lib/seo/siteConfig";
import { getConfiguredSiteUrl } from "@/lib/seo/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Site-wide metadata defaults. Pages override title/description/canonical
 * individually (see lib/seo/buildPageMetadata.ts). No canonical is set
 * here on purpose: a root-level canonical would be inherited by every
 * page that does not define its own and would mark them all as
 * duplicates of the home page.
 */
export function generateMetadata(): Metadata {
  const siteUrl = getConfiguredSiteUrl();
  const verification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    title: {
      default: `${siteConfig.name} | Interior Designers in Noida & Delhi NCR`,
      template: "%s",
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

  return (
    <html lang="en">
      <head>
        {/* GTM Script Component */}
        <GoogleTagManager gtmId={gtmId} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* GTM Noscript (Backup for disabled JS) - Must be at the very start of body for GSC verification */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <NextTopLoader
          color="#F97316"        // brand color
          height={3}
          showSpinner={false}
          crawlSpeed={200}
          easing="ease"
          speed={200}
        />

        {children}
      </body>
    </html>
  );
}
