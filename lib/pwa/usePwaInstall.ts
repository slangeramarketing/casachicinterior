"use client";

import { useEffect, useState } from "react";

/**
 * source of truth is window.deferredPrompt (set by layout head script)
 */
export function usePwaInstall() {
    const [canInstall, setCanInstall] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkPrompt = () => {
            if ((window as any).deferredPrompt) {
                setCanInstall(true);
                return true;
            }
            return false;
        };

        // 1. Detect environment
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
        setIsStandalone(standalone);

        // 2. Continuous check for prompt
        checkPrompt();
        const interval = setInterval(checkPrompt, 1000);

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            (window as any).deferredPrompt = e;
            setCanInstall(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const install = async () => {
        const promptObj = (window as any).deferredPrompt;
        if (!promptObj) return;

        try {
            await promptObj.prompt();
            const { outcome } = await promptObj.userChoice;
            if (outcome === "accepted") {
                (window as any).deferredPrompt = null;
                setCanInstall(false);
            }
        } catch (error) {
            console.error("PWA-LOG: Error during installation prompt:", error);
        }
    };

    return { canInstall, install, isIOS, isStandalone };
}
