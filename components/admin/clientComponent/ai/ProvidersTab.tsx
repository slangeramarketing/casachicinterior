import React, { useState } from "react";
import { saveProviderAction, deleteProviderAction } from "@/app/actions/ai.action";

export default function ProvidersTab({ initialProviders }: { initialProviders: any[] }) {
  const [providers, setProviders] = useState(initialProviders);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [form, setForm] = useState({
    provider: "Nvidia",
    model: "meta/llama-4-maverick-17b-128e-instruct",
    apiKey: "",
    isActive: true,
    expiresAt: "",
    dailyLimit: 100000,
    monthlyLimit: 3000000,
    rpm: 60
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      expiresAt: form.expiresAt ? new Date(form.expiresAt) : undefined
    };
    
    const res = await saveProviderAction(payload);
    if (res.success) {
      alert("Provider saved successfully!");
      window.location.reload(); // Quick refresh for now
    } else {
      alert("Failed: " + res.message);
    }
    setLoading(false);
  };

  const handleToggleActive = async (providerName: string, currentlyActive: boolean) => {
    if (currentlyActive) return; // Cannot deactivate self without activating another
    setLoading(true);
    await saveProviderAction({ provider: providerName, model: "", isActive: true });
    window.location.reload();
  };

  const handleDelete = async (providerName: string) => {
    if (!confirm("Are you sure you want to delete this provider?")) return;
    setLoading(true);
    await deleteProviderAction(providerName);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Configured Providers</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          {isAdding ? "Cancel" : "+ Add Provider"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
              <select 
                className="w-full border-gray-300 rounded-lg shadow-sm p-2 border"
                value={form.provider}
                onChange={e => setForm({...form, provider: e.target.value})}
              >
                <option value="Nvidia">Nvidia (NIM)</option>
                <option value="OpenAI">OpenAI</option>
                <option value="Anthropic">Anthropic</option>
                <option value="OpenRouter">OpenRouter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model String</label>
              <input 
                type="text" required
                className="w-full border-gray-300 rounded-lg shadow-sm p-2 border"
                value={form.model} onChange={e => setForm({...form, model: e.target.value})}
                placeholder="e.g. meta/llama-4-maverick..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input 
                type="password" required
                className="w-full border-gray-300 rounded-lg shadow-sm p-2 border"
                value={form.apiKey} onChange={e => setForm({...form, apiKey: e.target.value})}
                placeholder="sk-..."
              />
              <p className="text-xs text-gray-400 mt-1">Keys are encrypted before storing in the database.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Token Limit</label>
              <input 
                type="number" required
                className="w-full border-gray-300 rounded-lg shadow-sm p-2 border"
                value={form.dailyLimit} onChange={e => setForm({...form, dailyLimit: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
              <input 
                type="date"
                className="w-full border-gray-300 rounded-lg shadow-sm p-2 border"
                value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save Provider"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Provider</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Model</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Masked Key</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Daily Limit</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {providers.map((p) => (
                <tr key={p.provider} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.provider}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{p.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs whitespace-nowrap">{p.maskedKey}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{p.dailyLimit?.toLocaleString() || "∞"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      {!p.isActive && (
                        <button onClick={() => handleToggleActive(p.provider, p.isActive)} className="text-blue-600 hover:text-blue-800 font-medium">Activate</button>
                      )}
                      <button onClick={() => handleDelete(p.provider)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No providers configured.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
