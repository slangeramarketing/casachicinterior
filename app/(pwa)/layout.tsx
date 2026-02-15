import { Metadata } from "next";

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
      <head>
        {/* capture PWA event ASAP (Admin Side Only) */}
        <script
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
      </head>
      {children}
      <PwaInstallPopup />
    </>
  );
}
