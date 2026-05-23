"use client";

import React, { useState } from "react";
import LeadTable from "@/components/admin/LeadTable";
import AutomationControlTab from "./AutomationControlTab";
import { LeadResponseDTO } from "@/modules/leads/lead.dto";
import { IContactRuleDB } from "@/modules/contacts/contact-rule.types";
import { PageTitle } from "@/components/common/PageHeader";

interface Props {
  initialLeads: LeadResponseDTO[];
  initialRules: IContactRuleDB[];
  stats: { manual: number; auto: number; disabled: number; total: number };
  leadStats: any;
}

export default function LeadsDashboardTabs({ initialLeads, initialRules, stats, leadStats }: Props) {
  const [activeTab, setActiveTab] = useState<"leads" | "automation">("leads");

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab("leads")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "leads"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Leads Management
          </button>
          <button
            onClick={() => setActiveTab("automation")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "automation"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Automation Control
          </button>
        </nav>
      </div>

      <div className="px-4 sm:px-6">
        {activeTab === "leads" && (
          <LeadTable initialLeads={initialLeads} stats={leadStats} />
        )}
        
        {activeTab === "automation" && (
          <div className="pt-2">
            <div className="mb-6">
              <PageTitle 
                title="Automation Control" 
                description="Manage contacts that bypass AI automation and are handled manually."
              />
            </div>
            <AutomationControlTab initialRules={initialRules} stats={stats} />
          </div>
        )}
      </div>
    </div>
  );
}
