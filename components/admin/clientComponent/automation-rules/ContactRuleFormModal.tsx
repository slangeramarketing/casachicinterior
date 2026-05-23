"use client";

import React, { useState } from "react";
import { IContactRuleDB, ContactMode, ContactLabel, UpsertContactRuleDTO } from "@/modules/contacts/contact-rule.types";
import { upsertContactRuleAction } from "@/app/actions/contact-rules.action";

interface ContactRuleFormModalProps {
  initialData: IContactRuleDB | null;
  onClose: () => void;
  onSaved: (rule: IContactRuleDB) => void;
}

export default function ContactRuleFormModal({ initialData, onClose, onSaved }: ContactRuleFormModalProps) {
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [mode, setMode] = useState<ContactMode>(initialData?.mode || "AUTO");
  const [label, setLabel] = useState<ContactLabel>(initialData?.label || "UNKNOWN");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!phone) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    const dto: UpsertContactRuleDTO = { phone, mode, label, notes, enabled: initialData ? initialData.enabled : true };
    const res = await upsertContactRuleAction(dto);
    
    if (res.success) {
      onSaved({ ...dto, _id: initialData?._id || Math.random().toString(), enabled: dto.enabled! });
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">{initialData ? "Edit Rule" : "Add New Rule"}</h3>
        
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number (with Country Code)</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              disabled={!!initialData}
              placeholder="e.g. 919876543210"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border disabled:bg-gray-100" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mode</label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value as ContactMode)} 
              className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
            >
              <option value="AUTO">AUTO (AI Responds)</option>
              <option value="MANUAL">MANUAL (AI Skipped)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <select 
              value={label} 
              onChange={(e) => setLabel(e.target.value as ContactLabel)} 
              className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
            >
              <option value="UNKNOWN">UNKNOWN</option>
              <option value="LEAD">LEAD</option>
              <option value="CLIENT">CLIENT</option>
              <option value="RELATIVE">RELATIVE</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
