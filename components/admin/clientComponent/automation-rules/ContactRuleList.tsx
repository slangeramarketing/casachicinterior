"use client";

import React, { useState } from "react";
import { IContactRuleDB, ContactMode, ContactLabel } from "@/modules/contacts/contact-rule.types";
import { deleteContactRuleAction, toggleContactRuleAction } from "@/app/actions/contact-rules.action";
import ContactRuleFormModal from "./ContactRuleFormModal";

interface ContactRuleListProps {
  initialRules: IContactRuleDB[];
}

export default function ContactRuleList({ initialRules }: ContactRuleListProps) {
  const [rules, setRules] = useState<IContactRuleDB[]>(initialRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<IContactRuleDB | null>(null);

  const handleDelete = async (phone: string) => {
    if (!confirm(`Are you sure you want to delete the rule for ${phone}?`)) return;
    const res = await deleteContactRuleAction(phone);
    if (res.success) {
      setRules(rules.filter(r => r.phone !== phone));
    } else {
      alert(res.message);
    }
  };

  const handleToggle = async (phone: string, currentState: boolean) => {
    const res = await toggleContactRuleAction(phone, !currentState);
    if (res.success) {
      setRules(rules.map(r => r.phone === phone ? { ...r, enabled: !currentState } : r));
    } else {
      alert(res.message);
    }
  };

  const handleEdit = (rule: IContactRuleDB) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const onSaved = (updatedRule: IContactRuleDB) => {
    setRules(prev => {
      const exists = prev.find(r => r.phone === updatedRule.phone);
      if (exists) {
        return prev.map(r => r.phone === updatedRule.phone ? updatedRule : r);
      }
      return [updatedRule, ...prev];
    });
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Rules List</h2>
        <button 
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800"
        >
          Add New Rule
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rules.map((rule) => (
              <tr key={rule.phone}>
                <td className="px-6 py-4 whitespace-nowrap">{rule.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rule.mode === 'AUTO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {rule.mode}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{rule.label}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{rule.notes || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => handleToggle(rule.phone, rule.enabled)}
                    className={`px-3 py-1 rounded text-sm ${rule.enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(rule)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(rule.phone)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No automation rules found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ContactRuleFormModal 
          initialData={editingRule} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={onSaved} 
        />
      )}
    </div>
  );
}
