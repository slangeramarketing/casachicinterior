"use client";
import React, { useState } from "react";
import { FaRobot, FaCoins, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaFire, FaHourglassEnd, FaPowerOff } from "react-icons/fa";
import { toggleAiPauseAction } from "@/app/actions/ai.action";

export default function OverviewTab({ stats, providers, settings }: { stats: any; providers: any[]; settings: any }) {
  const activeProvider = stats.activeProvider;
  const [isPaused, setIsPaused] = useState(settings?.isAiPaused || false);
  const [loading, setLoading] = useState(false);

  const handleTogglePause = async () => {
    if (!confirm(isPaused ? "Resume global AI routing?" : "EMERGENCY: Pause all AI processing immediately?")) return;
    setLoading(true);
    const res = await toggleAiPauseAction(!isPaused);
    if (res.success && res.data) setIsPaused(res.data.isAiPaused);
    setLoading(false);
  };

  // Calculations for new cards
  const daysUntilExpiry = activeProvider?.expiresAt 
    ? Math.ceil((new Date(activeProvider.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : null;
    
  // Simple avg burn rate (using monthTokens divided by current day of month)
  const currentDay = new Date().getDate();
  const currentBurnRate = Math.ceil((stats.monthTokens || 0) / currentDay);
  
  const projectedExhaust = activeProvider?.monthlyLimit && currentBurnRate > 0
    ? Math.ceil((activeProvider.monthlyLimit - (stats.monthTokens || 0)) / currentBurnRate)
    : null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FaRobot size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">Active Provider</div>
            <div className="text-lg font-bold text-gray-900">{activeProvider ? activeProvider.provider : "None"}</div>
            <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[150px]">{activeProvider?.model || "—"}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <span className="font-bold">T</span>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">Tokens Today</div>
            <div className="text-2xl font-bold text-gray-900">{stats.todayTokens?.toLocaleString() || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <FaCoins size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">Est. Cost (Month)</div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{((stats.monthTokens || 0) / 1000000 * 42).toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Based on Llama-4 ₹42/1M</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            {activeProvider ? <FaCheckCircle size={20} className="text-green-500" /> : <FaExclamationTriangle size={20} className="text-red-500"/>}
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">API Status</div>
            <div className="text-lg font-bold text-gray-900">{activeProvider ? "Healthy" : "Offline"}</div>
            <div className="text-xs text-gray-400 mt-0.5">Expires: {activeProvider?.expiresAt ? new Date(activeProvider.expiresAt).toLocaleDateString() : "Never"}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <FaCalendarAlt size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">Days Until Expiry</div>
            <div className="text-2xl font-bold text-gray-900">{daysUntilExpiry !== null ? daysUntilExpiry : "∞"}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <FaFire size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">Current Burn Rate</div>
            <div className="text-2xl font-bold text-gray-900">{currentBurnRate.toLocaleString()} <span className="text-sm font-normal text-gray-500">tokens/day</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-stone-50 text-stone-600 flex items-center justify-center">
            <FaHourglassEnd size={20} />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase">Projected Exhaust</div>
            <div className="text-xl font-bold text-gray-900">{projectedExhaust !== null ? `in ${projectedExhaust} days` : "Never"}</div>
          </div>
        </div>
      </div>

      {/* Emergency Control & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-4">System Alerts</h3>
          {isPaused && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm font-medium mb-4">
              🚨 AI HAS BEEN GLOBALLY PAUSED. Fallback responses are currently active.
            </div>
          )}
          {!activeProvider && !isPaused && (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100 text-sm font-medium mb-4">
              ⚠️ No active AI Provider found. The WhatsApp bot will not function until a provider is configured and activated in the Providers tab.
            </div>
          )}
          {activeProvider && !isPaused && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm font-medium">
              ✅ AI Systems are operational and routing traffic through {activeProvider.provider}.
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FaPowerOff className={isPaused ? "text-red-600" : "text-gray-400"} size={24} />
            <h3 className="text-lg font-bold text-red-600">Emergency Control</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">Instantly halt all AI processing. Use this if the provider is failing, limits are breached, or rogue outputs are detected.</p>
          <button 
            onClick={handleTogglePause}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold transition-all text-white shadow-md ${isPaused ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} ${loading ? "opacity-50" : ""}`}
          >
            {loading ? "Processing..." : isPaused ? "RESUME AI PROCESSING" : "PAUSE AI IMMEDIATELY"}
          </button>
        </div>
      </div>
    </div>
  );
}
