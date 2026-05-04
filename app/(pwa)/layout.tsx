import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  manifest: "/manifest.json",
};

import PwaInstallPopup from "@/components/pwa/PwaInstallPopup";

export default function PwaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* capture PWA event ASAP (Admin Side Only) */}
      <Script
        id="pwa-capture"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.deferredPrompt = null;
            window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              window.deferredPrompt = e;
              console.log('PWA-LOG: Admin early capture event fired');
            });
          `,
        }}
      />
      {children}
      <PwaInstallPopup />
    </>
  );
}
