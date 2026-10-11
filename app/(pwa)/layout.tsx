import { Metadata } from "next";
import PwaInstallPopup from "@/components/pwa/PwaInstallPopup";

export const metadata: Metadata = {
  manifest: "/manifest.json",
};

export default function PwaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
        Capture the PWA install event as early as possible (admin side only).
        Rendered inline in the body on purpose: a nested layout must not render
        its own <head> (React 19 reports "<body> cannot contain a nested <head>"),
        and an inline script executes the moment the HTML parser reaches it,
        which is before hydration and before the hook in lib/pwa/usePwaInstall.ts
        registers its own listener.
      */}
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
      {children}
      <PwaInstallPopup />
    </>
  );
}
