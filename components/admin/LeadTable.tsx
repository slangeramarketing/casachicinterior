"use client";

import { useState } from "react";
import FilterDropdown from "@/components/common/FilterDropdown";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { LeadResponseDTO } from "@/modules/leads/lead.dto";
import { FaTrash } from "react-icons/fa";
import { deleteLeadAction } from "@/app/(pwa)/admin/leads/actions/delete-lead.action";

interface Props {
  initialLeads: LeadResponseDTO[];
}

export default function LeadTable({ initialLeads }: Props) {
  const [items, setItems] = useState<LeadResponseDTO[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(phone: string) {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    setIsDeleting(phone);
    try {
      const success = await deleteLeadAction(phone);
      if (success) {
        setItems(prev => prev.filter(lead => lead.phone !== phone));
      } else {
        alert("Failed to delete lead.");
      }
    } catch (error) {
      alert("Error deleting lead.");
    } finally {
      setIsDeleting(null);
    }
  }

  const filteredItems = items
    .filter((lead) => {
      // 1. Status Filter
      if (filter !== "all" && lead.status !== filter) return false;
      
      // 2. Search Filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (lead.name || "").toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q)
      );
    });

  return (
    <section className="min-h-screen px-4 py-6 sm:p-6">
      <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4 justify-between pb-2">
        <PageRouteHeader />
        <div className="flex md:flex-row flex-col gap-4 items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or phone..."
            className="md:w-auto w-full"
          />

          <div className=" md:w-auto w-full flex gap-4 items-center">
            <FilterDropdown
              value={filter}
              onChange={setFilter}
              options={[
                { label: "All Statuses", value: "all" },
                { label: "New", value: "new" },
                { label: "Qualified", value: "qualified" },
                { label: "Site Visit Scheduled", value: "site_visit_scheduled" },
                { label: "Converted", value: "converted" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full pb-8 mt-4">
        <PageTitle
          title="Leads Management"
          description="Manage and track your WhatsApp AI leads"
        />
      </div>

      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            🚫 No leads found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Requirement</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Created At</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-800">{lead.name || "—"}</td>
                    <td className="p-4 text-sm text-gray-600">{lead.phone}</td>
                    <td className="p-4 text-sm text-gray-600">{lead.location || "—"}</td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={lead.requirement || ""}>
                      {lead.requirement || "—"}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${lead.status === 'new' ? 'bg-blue-50 text-blue-600' : 
                          lead.status === 'qualified' ? 'bg-yellow-50 text-yellow-600' : 
                          lead.status === 'converted' ? 'bg-green-50 text-green-600' : 
                          'bg-purple-50 text-purple-600'}`}>
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(lead.phone)}
                        disabled={isDeleting === lead.phone}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Lead"
                      >
                        {isDeleting === lead.phone ? "..." : <FaTrash size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
