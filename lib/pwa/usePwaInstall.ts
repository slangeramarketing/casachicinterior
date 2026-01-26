"use client";

import { useEffect, useState } from "react";

let deferredPrompt: any = null;

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // 🔥 browser default popup STOP
      deferredPrompt = e;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    deferredPrompt = null;
    setCanInstall(false);

    return choice;
  };

  return { canInstall, install };
}
