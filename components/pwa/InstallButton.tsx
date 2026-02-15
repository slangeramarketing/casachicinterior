"use client";

import { useState } from "react";
import { usePwaInstall } from "@/lib/pwa/usePwaInstall";
import { FiDownload, FiShare, FiPlusSquare, FiX } from "react-icons/fi";
import { MdInstallMobile } from "react-icons/md";

export default function InstallButton() {
    const { canInstall, install, isIOS, isStandalone } = usePwaInstall();
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    if (isStandalone) return null;

    const handleInstallClick = () => {
        if (isIOS) {
            setShowIOSInstructions(true);
        } else if (canInstall) {
            install();
        }
    };

    return (
        <div className="mt-8 border-t pt-6">
            {!showIOSInstructions ? (
                <button
                    onClick={handleInstallClick}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
            bg-gray-900 text-white font-bold hover:bg-black transition-all
            shadow-lg active:scale-95"
                >
                    <MdInstallMobile className="text-xl" />
                    Install App for Better Experience
                </button>
            ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 relative animate-in fade-in slide-in-from-bottom-2">
                    <button
                        onClick={() => setShowIOSInstructions(false)}
                        className="absolute top-2 right-2 text-orange-400 hover:text-orange-600"
                    >
                        <FiX />
                    </button>

                    <h3 className="font-bold text-orange-800 text-sm mb-3 flex items-center gap-2">
                        <FiDownload /> How to Install on iPhone
                    </h3>

                    <ul className="space-y-3 text-xs text-orange-700">
                        <li className="flex items-start gap-2">
                            <span className="bg-orange-200 text-orange-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                            <span>Tap the <strong>Share</strong> button <FiShare className="inline mb-1" /> at the bottom of Safari.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-orange-200 text-orange-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                            <span>Scroll down and tap <strong>Add to Home Screen</strong> <FiPlusSquare className="inline mb-1" />.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-orange-200 text-orange-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0">3</span>
                            <span>Tap <strong>Add</strong> in the top right corner.</span>
                        </li>
                    </ul>
                </div>
            )}

            {!isIOS && !canInstall && !showIOSInstructions && (
                <p className="text-[10px] text-gray-400 text-center mt-2">
                    PWA is ready. If button doesn't work, use your browser's menu to "Install App".
                </p>
            )}
        </div>
    );
}
