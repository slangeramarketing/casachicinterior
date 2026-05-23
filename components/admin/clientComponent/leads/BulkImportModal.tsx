"use client";

import React, { useState } from "react";
import { UpsertContactRuleDTO } from "@/modules/contacts/contact-rule.types";
import { bulkImportContactRulesAction } from "@/app/actions/contact-rules.action";

interface BulkImportModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export default function BulkImportModal({ onClose, onSaved }: BulkImportModalProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ added: number; skipped: number } | null>(null);

  const normalizePhone = (phone: string) => {
    let clean = phone.replace(/[\s\-\(\)]/g, "");
    if (!clean.startsWith("91") && clean.length === 10) {
      clean = "91" + clean;
    } else if (clean.startsWith("+91")) {
      clean = clean.substring(1);
    }
    return clean;
  };

  const handleImport = async () => {
    setError("");
    setResult(null);
    if (!text.trim()) {
      setError("Please paste some phone numbers.");
      return;
    }

    setLoading(true);
    
    // Parse
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const rules: UpsertContactRuleDTO[] = [];
    
    for (const line of lines) {
      // Very basic parsing: try to separate phone and optionally mode/label if provided by comma.
      // But user requested mostly textarea with phones.
      const parts = line.split(",");
      const phone = normalizePhone(parts[0]);
      
      if (phone.length < 10) continue; // skip invalid

      rules.push({
        phone,
        mode: "MANUAL",
        label: "UNKNOWN",
        enabled: true
      });
    }

    if (rules.length === 0) {
      setError("No valid phone numbers found to import.");
      setLoading(false);
      return;
    }

    const res = await bulkImportContactRulesAction(rules);
    if (res.success) {
      setResult({ added: res.added || 0, skipped: res.skipped || 0 });
    } else {
      setError(res.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Bulk Import Contacts</h3>
        
        {result ? (
          <div className="mb-6 p-4 bg-green-50 text-green-800 rounded">
            <p className="font-semibold">Import Complete!</p>
            <p>Added/Updated: {result.added}</p>
            <p>Skipped: {result.skipped}</p>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={onSaved}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Close & Refresh
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Paste phone numbers below (one per line). They will be added as <strong>MANUAL</strong> / <strong>UNKNOWN</strong>.
              <br/>
              <em>Example:</em><br/>
              919876543210<br/>
              9988776655
            </p>

            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              rows={8}
              placeholder="Paste numbers here..."
              className="mt-1 block w-full rounded border-gray-300 shadow-sm p-3 border font-mono text-sm"
            />

            <div className="flex justify-end space-x-3 pt-6">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleImport} 
                disabled={loading || !text.trim()}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? "Importing..." : "Import"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
