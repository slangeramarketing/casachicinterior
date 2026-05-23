"use client";

import React, { useState } from "react";
import { IContactRuleDB } from "@/modules/contacts/contact-rule.types";
import { deleteContactRuleAction, toggleContactRuleAction, bulkDeleteContactRulesAction } from "@/app/actions/contact-rules.action";
import ContactRuleFormModal from "../automation-rules/ContactRuleFormModal";
import BulkImportModal from "./BulkImportModal";
import SearchInput from "@/components/common/SearchInput";
import FilterDropdown from "@/components/common/FilterDropdown";

interface Props {
  initialRules: IContactRuleDB[];
  stats: { manual: number; auto: number; disabled: number; total: number };
}

export default function AutomationControlTab({ initialRules, stats }: Props) {
  const [rules, setRules] = useState<IContactRuleDB[]>(initialRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<IContactRuleDB | null>(null);
  
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [filterLabel, setFilterLabel] = useState("all");
  
  const [selectedPhones, setSelectedPhones] = useState<Set<string>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const handleDelete = async (phone: string) => {
    if (!confirm(`Are you sure you want to delete the rule for ${phone}?`)) return;
    const res = await deleteContactRuleAction(phone);
    if (res.success) {
      setRules(rules.filter(r => r.phone !== phone));
    } else {
      alert(res.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPhones.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedPhones.size} rules?`)) return;
    
    setIsDeletingBulk(true);
    const phones = Array.from(selectedPhones);
    const res = await bulkDeleteContactRulesAction(phones);
    if (res.success) {
      setRules(rules.filter(r => !selectedPhones.has(r.phone)));
      setSelectedPhones(new Set());
    } else {
      alert(res.message);
    }
    setIsDeletingBulk(false);
  };

  const handleToggle = async (phone: string, currentState: boolean) => {
    const res = await toggleContactRuleAction(phone, !currentState);
    if (res.success) {
      setRules(rules.map(r => r.phone === phone ? { ...r, enabled: !currentState } : r));
    } else {
      alert(res.message);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPhones(new Set(filteredRules.map(r => r.phone)));
    } else {
      setSelectedPhones(new Set());
    }
  };

  const handleSelectOne = (phone: string, checked: boolean) => {
    const newSet = new Set(selectedPhones);
    if (checked) newSet.add(phone);
    else newSet.delete(phone);
    setSelectedPhones(newSet);
  };

  const filteredRules = rules.filter(r => {
    if (filterMode !== "all" && r.mode !== filterMode) return false;
    if (filterLabel !== "all" && r.label !== filterLabel) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!r.phone.includes(q) && !(r.notes || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-500 mb-1">Manual Contacts</div>
          <div className="text-xl sm:text-2xl font-bold">{stats.manual}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-500 mb-1">Auto Contacts</div>
          <div className="text-xl sm:text-2xl font-bold">{stats.auto}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-500 mb-1">Disabled Rules</div>
          <div className="text-xl sm:text-2xl font-bold">{stats.disabled}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs sm:text-sm text-gray-500 mb-1">Total Rules</div>
          <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
        </div>
      </div>

      {/* Top Actions & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center w-full lg:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput value={search} onChange={setSearch} placeholder="Search phone or notes..." className="w-full" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <FilterDropdown 
              value={filterMode} 
              onChange={setFilterMode} 
              options={[{ label: "All Modes", value: "all" }, { label: "AUTO", value: "AUTO" }, { label: "MANUAL", value: "MANUAL" }]} 
            />
            <FilterDropdown 
              value={filterLabel} 
              onChange={setFilterLabel} 
              options={[
                { label: "All Labels", value: "all" }, 
                { label: "CLIENT", value: "CLIENT" }, 
                { label: "RELATIVE", value: "RELATIVE" },
                { label: "VIP", value: "VIP" },
                { label: "UNKNOWN", value: "UNKNOWN" }
              ]} 
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {selectedPhones.size > 0 && (
            <button onClick={handleBulkDelete} disabled={isDeletingBulk} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium w-full sm:w-auto">
              Delete ({selectedPhones.size})
            </button>
          )}
          <button onClick={() => setIsBulkImportOpen(true)} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex-1 sm:flex-none text-center">
            Bulk Import
          </button>
          <button onClick={() => { setEditingRule(null); setIsModalOpen(true); }} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex-1 sm:flex-none text-center">
            Add Contact
          </button>
        </div>
      </div>

      {/* Table / Mobile Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredRules.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No automation rules match your filters.</div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredRules.map((rule) => (
                <div key={rule.phone} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedPhones.has(rule.phone)} 
                        onChange={(e) => handleSelectOne(rule.phone, e.target.checked)} 
                      />
                      <div className="text-base font-bold text-gray-800">{rule.phone}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${rule.mode === 'AUTO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {rule.mode}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="font-medium text-gray-600">{rule.label}</div>
                    <button 
                      onClick={() => handleToggle(rule.phone, rule.enabled)}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${rule.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {rule.notes && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                      {rule.notes}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <button onClick={() => { setEditingRule(rule); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-900 font-medium text-sm">Edit</button>
                    <button onClick={() => handleDelete(rule.phone)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 w-10">
                      <input type="checkbox" onChange={handleSelectAll} checked={selectedPhones.size === filteredRules.length && filteredRules.length > 0} />
                    </th>
                    <th className="p-4 font-semibold">Phone</th>
                    <th className="p-4 font-semibold">Mode</th>
                    <th className="p-4 font-semibold">Label</th>
                    <th className="p-4 font-semibold">Notes</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRules.map((rule) => (
                    <tr key={rule.phone} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <input type="checkbox" checked={selectedPhones.has(rule.phone)} onChange={(e) => handleSelectOne(rule.phone, e.target.checked)} />
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-800">{rule.phone}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${rule.mode === 'AUTO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {rule.mode}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{rule.label}</td>
                      <td className="p-4 text-sm text-gray-500 max-w-[200px] truncate" title={rule.notes || ''}>{rule.notes || "—"}</td>
                      <td className="p-4 text-sm">
                        <button 
                          onClick={() => handleToggle(rule.phone, rule.enabled)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${rule.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4 text-right text-sm">
                        <button onClick={() => { setEditingRule(rule); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-900 mr-3 font-medium">Edit</button>
                        <button onClick={() => handleDelete(rule.phone)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <ContactRuleFormModal 
          initialData={editingRule} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={() => { setIsModalOpen(false); window.location.reload(); }} 
        />
      )}
      
      {isBulkImportOpen && (
        <BulkImportModal 
          onClose={() => setIsBulkImportOpen(false)}
          onSaved={() => { setIsBulkImportOpen(false); window.location.reload(); }}
        />
      )}
    </div>
  );
}
