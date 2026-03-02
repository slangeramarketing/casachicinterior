import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import GoogleTagManager from "@/lib/GoogleTagManager";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://casachicinterior.com',
  },
  verification: {
    google: "YOUR_CODE_HERE", // Backup verification code
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";
  console.log("GTM ID: ", gtmId);

  return (
    <html lang="en">
      <head>
        {/* GTM Script Component */}
        <GoogleTagManager gtmId={gtmId} />
      </head>
      <body>
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
