"use client";

import { useState } from "react";
import FilterDropdown from "@/components/common/FilterDropdown";
import SearchInput from "@/components/common/SearchInput";
import { LeadResponseDTO } from "@/modules/leads/lead.dto";
import { FaTrash, FaWhatsapp, FaPhone } from "react-icons/fa";
import { deleteLeadAction } from "@/app/(pwa)/admin/leads/actions/delete-lead.action";
import LeadDetailDrawer from "./clientComponent/leads/LeadDetailDrawer";
import { bulkUpdateLeadsAction } from "@/app/actions/lead.action";

interface Props {
  initialLeads: LeadResponseDTO[];
  stats: { total: number; new: number; qualified: number; converted: number; manual: number; auto: number };
}

export default function LeadTable({ initialLeads, stats }: Props) {
  const [items, setItems] = useState<LeadResponseDTO[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // New State for CRM features
  const [selectedPhones, setSelectedPhones] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<LeadResponseDTO | null>(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  async function handleDelete(phone: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this lead?")) return;
    setIsDeleting(phone);
    try {
      const success = await deleteLeadAction(phone);
      if (success) {
        setItems(prev => prev.filter(lead => lead.phone !== phone));
        if (selectedLead?.phone === phone) setSelectedLead(null);
      } else {
        alert("Failed to delete lead.");
      }
    } catch (error) {
      alert("Error deleting lead.");
    } finally {
      setIsDeleting(null);
    }
  }

  const handleBulkStatusChange = async (status: string) => {
    if (selectedPhones.size === 0) return;
    setIsBulkLoading(true);
    const phones = Array.from(selectedPhones);
    const res = await bulkUpdateLeadsAction(phones, { status });
    if (res.success) {
      setItems(prev => prev.map(l => selectedPhones.has(l.phone) ? { ...l, status } : l));
      setSelectedPhones(new Set());
    } else {
      alert(res.message);
    }
    setIsBulkLoading(false);
  };

  const handleBulkAutomation = async (mode: "AUTO" | "MANUAL") => {
    if (selectedPhones.size === 0) return;
    setIsBulkLoading(true);
    const phones = Array.from(selectedPhones);
    const res = await bulkUpdateLeadsAction(phones, { automationMode: mode });
    if (res.success) {
      setItems(prev => prev.map(l => selectedPhones.has(l.phone) ? { ...l, automationMode: mode } : l));
      setSelectedPhones(new Set());
    } else {
      alert(res.message);
    }
    setIsBulkLoading(false);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPhones(new Set(filteredItems.map(l => l.phone)));
    } else {
      setSelectedPhones(new Set());
    }
  };

  const handleSelectOne = (phone: string, checked: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedPhones);
    if (checked) newSet.add(phone);
    else newSet.delete(phone);
    setSelectedPhones(newSet);
  };

  const filteredItems = items.filter((lead) => {
    if (filter !== "all" && lead.status !== filter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (lead.name || "").toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      (lead.location || "").toLowerCase().includes(q) ||
      (lead.requirement || "").toLowerCase().includes(q)
    );
  });

  const getScoreIcon = (score: number) => {
    if (score >= 50) return "🔥";
    if (score >= 20) return "🟡";
    return "⚪";
  };

  return (
    <div className="space-y-6 pt-2">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Leads", val: stats?.total || items.length },
          { label: "New", val: stats?.new || items.filter(i => i.status === "NEW").length },
          { label: "Qualified", val: stats?.qualified || items.filter(i => i.status === "QUALIFIED").length },
          { label: "Clients", val: items.filter(i => i.label === "CLIENT").length },
          { label: "Auto AI", val: stats?.auto || items.filter(i => i.automationMode === "AUTO").length },
          { label: "AI Bypassed", val: stats?.manual || items.filter(i => i.automationMode === "MANUAL").length }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-500 mb-1 font-medium uppercase">{stat.label}</div>
            <div className="text-xl font-bold">{stat.val}</div>
          </div>
        ))}
      </div>

      {/* Top Actions & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center w-full md:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput value={search} onChange={setSearch} placeholder="Search phone, name, loc..." className="w-full" />
          </div>
          <FilterDropdown
            value={filter}
            onChange={setFilter}
            options={[
              { label: "All Statuses", value: "all" },
              { label: "NEW", value: "NEW" },
              { label: "CONTACTED", value: "CONTACTED" },
              { label: "QUALIFIED", value: "QUALIFIED" },
              { label: "SITE_VISIT", value: "SITE_VISIT" },
              { label: "QUOTE_SENT", value: "QUOTE_SENT" },
              { label: "NEGOTIATION", value: "NEGOTIATION" },
              { label: "CONVERTED", value: "CONVERTED" },
              { label: "LOST", value: "LOST" }
            ]}
          />
        </div>
        
        {/* Bulk Actions */}
        <div className="flex flex-wrap gap-2 items-center">
          {selectedPhones.size > 0 && (
            <>
              <span className="text-sm font-medium mr-2">{selectedPhones.size} selected</span>
              <button disabled={isBulkLoading} onClick={() => handleBulkStatusChange("QUALIFIED")} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-100">Set Qualified</button>
              <button disabled={isBulkLoading} onClick={() => handleBulkAutomation("MANUAL")} className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold rounded-md hover:bg-orange-100">Disable AI</button>
              <button disabled={isBulkLoading} onClick={() => handleBulkAutomation("AUTO")} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-md hover:bg-green-100">Enable AI</button>
            </>
          )}
        </div>
      </div>

      {/* Responsive List / Table */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">🚫 No leads found</div>
        ) : (
          <>
            {/* Mobile View (Cards) */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredItems.map((lead) => (
                <div 
                  key={lead.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer flex flex-col gap-3"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedPhones.has(lead.phone)} 
                        onChange={(e) => handleSelectOne(lead.phone, e.target.checked, e as any)} 
                        onClick={e => e.stopPropagation()} 
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-800">{lead.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500">+{lead.phone}</div>
                      </div>
                    </div>
                    <div className="text-lg" title={`Score: ${lead.leadScore || 0}`}>
                      {getScoreIcon(lead.leadScore || 0)}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="font-medium">{lead.requirement || "No requirement specified"}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{lead.location || "No location"}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${lead.status === 'NEW' ? 'bg-blue-50 text-blue-600' : 
                          lead.status === 'QUALIFIED' ? 'bg-indigo-50 text-indigo-600' : 
                          lead.status === 'SITE_VISIT' ? 'bg-purple-50 text-purple-600' :
                          lead.status === 'CONVERTED' ? 'bg-green-50 text-green-600' : 
                          lead.status === 'LOST' ? 'bg-red-50 text-red-600' :
                          'bg-yellow-50 text-yellow-600'}`}>
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                        {lead.label || "UNKNOWN"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center ${(lead.conversationOwner || lead.automationMode) === 'AUTO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {(lead.conversationOwner || lead.automationMode) === 'AUTO' ? '🤖 AUTO' : '🧑‍💻 MANUAL'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-1">
                    <div className="text-xs text-gray-400 font-medium">
                      {new Date(lead.lastActivityAt || lead.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'
                      })}
                    </div>
                    <div className="flex justify-end gap-4 items-center">
                      <button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.phone}`, '_blank') }} className="text-green-600 hover:text-green-800" title="WhatsApp"><FaWhatsapp size={16}/></button>
                      <button onClick={(e) => { e.stopPropagation(); window.location.href = `tel:+${lead.phone}` }} className="text-blue-600 hover:text-blue-800" title="Call"><FaPhone size={14} /></button>
                      <button
                        onClick={(e) => handleDelete(lead.phone, e as any)}
                        disabled={isDeleting === lead.phone}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        title="Delete Lead"
                      >
                        {isDeleting === lead.phone ? "..." : <FaTrash size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 w-10">
                      <input type="checkbox" onChange={handleSelectAll} checked={selectedPhones.size === filteredItems.length && filteredItems.length > 0} />
                    </th>
                    <th className="p-4 font-semibold">Score</th>
                    <th className="p-4 font-semibold">Name / Phone</th>
                    <th className="p-4 font-semibold">Requirement</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Label / Owner</th>
                    <th className="p-4 font-semibold">Last Activity</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <input type="checkbox" checked={selectedPhones.has(lead.phone)} onChange={(e) => handleSelectOne(lead.phone, e.target.checked, e as any)} onClick={e => e.stopPropagation()} />
                      </td>
                      <td className="p-4 text-lg" title={`Score: ${lead.leadScore || 0}`}>
                        {getScoreIcon(lead.leadScore || 0)}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-gray-800">{lead.name || "Unknown"}</div>
                        <div className="text-xs text-gray-500">+{lead.phone}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                        <div className="font-medium">{lead.requirement || "—"}</div>
                        <div className="text-xs text-gray-400">{lead.location || "—"}</div>
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                          ${lead.status === 'NEW' ? 'bg-blue-50 text-blue-600' : 
                            lead.status === 'QUALIFIED' ? 'bg-indigo-50 text-indigo-600' : 
                            lead.status === 'SITE_VISIT' ? 'bg-purple-50 text-purple-600' :
                            lead.status === 'CONVERTED' ? 'bg-green-50 text-green-600' : 
                            lead.status === 'LOST' ? 'bg-red-50 text-red-600' :
                            'bg-yellow-50 text-yellow-600'}`}>
                          {lead.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                            {lead.label || "UNKNOWN"}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${(lead.conversationOwner || lead.automationMode) === 'AUTO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {(lead.conversationOwner || lead.automationMode) === 'AUTO' ? '🤖 AUTO' : '🧑‍💻 MANUAL'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(lead.lastActivityAt || lead.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3 items-center">
                          <button onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.phone}`, '_blank') }} className="text-green-600 hover:text-green-800" title="WhatsApp"><FaWhatsapp /></button>
                          <button onClick={(e) => { e.stopPropagation(); window.location.href = `tel:+${lead.phone}` }} className="text-blue-600 hover:text-blue-800" title="Call"><FaPhone size={12} /></button>
                          <button
                            onClick={(e) => handleDelete(lead.phone, e as any)}
                            disabled={isDeleting === lead.phone}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                            title="Delete Lead"
                          >
                            {isDeleting === lead.phone ? "..." : <FaTrash size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Drawer */}
      {selectedLead && (
        <LeadDetailDrawer 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onUpdate={(updated) => {
            setItems(items.map(l => l.phone === updated.phone ? updated : l));
            setSelectedLead(updated);
          }}
        />
      )}
    </div>
  );
}
