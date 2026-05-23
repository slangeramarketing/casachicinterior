"use client";

import React, { useState } from "react";
import OverviewTab from "./OverviewTab";
import ProvidersTab from "./ProvidersTab";
import UsageTab from "./UsageTab";
import LimitsTab from "./LimitsTab";

interface Props {
  initialStats: any;
  initialProviders: any[];
  initialUsage: any[];
  initialLimits: any[];
  initialSettings: any;
}

export default function AiDashboardTabs({ initialStats, initialProviders, initialUsage, initialLimits, initialSettings }: Props) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar bg-gray-50 scroll-smooth">
        {[
          { id: "overview", label: "Overview" },
          { id: "providers", label: "Providers" },
          { id: "usage", label: "Usage & Logs" },
          { id: "limits", label: "Limits & Quotas" },
          { id: "settings", label: "Settings" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 sm:px-6 sm:py-4 text-sm font-semibold whitespace-nowrap transition-colors relative
              ${activeTab === tab.id 
                ? "text-blue-600 bg-white" 
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/30">
        {activeTab === "overview" && <OverviewTab stats={initialStats} providers={initialProviders} settings={initialSettings} />}
        {activeTab === "providers" && <ProvidersTab initialProviders={initialProviders} />}
        {activeTab === "usage" && <UsageTab initialUsage={initialUsage} />}
        {activeTab === "limits" && <LimitsTab limitEvents={initialLimits} />}
        
        {activeTab === "settings" && (
          <div className="text-center p-8 sm:p-12 text-gray-500">
            <h3 className="text-lg font-bold mb-2">AI Settings</h3>
            <p className="text-sm sm:text-base">Configure fallback providers and global AI pauses. (Coming Soon)</p>
          </div>
        )}
      </div>
    </div>
  );
}
