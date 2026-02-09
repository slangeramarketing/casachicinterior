"use client";

// file location: app/pwa-suppress.tsx

import { useEffect } from "react";

export default function PwaSuppressor() {
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return null;
}
