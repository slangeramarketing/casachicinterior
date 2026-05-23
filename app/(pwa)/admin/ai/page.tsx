import React from "react";
import AiDashboardTabs from "@/components/admin/clientComponent/ai/AiDashboardTabs";
import { getAiStatsAction, getAllProvidersAction, getAiUsageAction, getLimitEventsAction, getSettingsAction } from "@/app/actions/ai.action";

export default async function AiManagementPage() {
  const [statsRes, providersRes, usageRes, limitsRes, settingsRes] = await Promise.all([
    getAiStatsAction(),
    getAllProvidersAction(),
    getAiUsageAction(100),
    getLimitEventsAction(50),
    getSettingsAction()
  ]);

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50/50">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Operations Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage AI providers, track API token usage, and monitor costs.</p>
        </div>
      </div>

      <AiDashboardTabs 
        initialStats={statsRes.data || {}} 
        initialProviders={providersRes.data || []}
        initialUsage={usageRes.data || []}
        initialLimits={limitsRes.data || []}
        initialSettings={settingsRes.data || { isAiPaused: false }}
      />
    </div>
  );
}
