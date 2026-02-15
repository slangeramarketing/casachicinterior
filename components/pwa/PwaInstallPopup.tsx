"use client";

import { useState, useEffect } from "react";
import { usePwaInstall } from "@/lib/pwa/usePwaInstall";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiDownload, FiShare, FiPlusSquare } from "react-icons/fi";
import { MdInstallMobile } from "react-icons/md";

export default function PwaInstallPopup() {
    const { canInstall, install, isIOS, isStandalone } = usePwaInstall();
    const [isVisible, setIsVisible] = useState(false);
    const [showIOSHint, setShowIOSHint] = useState(false);

    useEffect(() => {
        // Delay showing the popup to not annoy the user immediately
        if ((canInstall || isIOS) && !isStandalone) {
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [canInstall, isIOS, isStandalone]);

    if (isStandalone || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-sm"
            >
                <div className="bg-white/90 backdrop-blur-xl border border-orange-100 shadow-2xl rounded-3xl p-6 relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-10 -mt-10 blur-2xl" />

                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={20} />
                    </button>

                    {!showIOSHint ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 mb-4 animate-bounce-slow">
                                <MdInstallMobile size={32} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Install CasaChic App
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Get a faster, more seamless experience on your home screen.
                            </p>

                            <button
                                onClick={() => {
                                    if (isIOS) setShowIOSHint(true);
                                    else install();
                                }}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <FiDownload />
                                Install Now
                            </button>
                        </div>
                    ) : (
                        <div className="pt-2">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FiDownload className="text-orange-500" /> Install on iPhone
                            </h3>
                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex items-center gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                    <span>Tap the <strong>Share</strong> icon <FiShare className="inline mb-1" /></span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                    <span>Select <strong>Add to Home Screen</strong> <FiPlusSquare className="inline mb-1" /></span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowIOSHint(false)}
                                className="w-full mt-6 text-sm text-orange-600 font-semibold hover:underline"
                            >
                                Back to install
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
