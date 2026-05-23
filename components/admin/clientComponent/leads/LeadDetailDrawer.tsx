"use client";

import React, { useState } from "react";
import { LeadResponseDTO } from "@/modules/leads/lead.dto";
import { updateLeadDetailsAction } from "@/app/actions/lead.action";
import { FaTimes, FaWhatsapp, FaPhone } from "react-icons/fa";

interface Props {
  lead: LeadResponseDTO;
  onClose: () => void;
  onUpdate: (updatedLead: LeadResponseDTO) => void;
}

export default function LeadDetailDrawer({ lead, onClose, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<"profile" | "conversation" | "timeline">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Editable fields state
  const [formData, setFormData] = useState({
    name: lead.name || "",
    phone: lead.phone,
    location: lead.location || "",
    requirement: lead.requirement || "",
    status: lead.status,
    owner: lead.owner || "",
    notes: lead.notes || "",
    automationMode: lead.automationMode || "AUTO",
    label: lead.label || "UNKNOWN",
    conversationOwner: lead.conversationOwner || lead.automationMode || "AUTO",
  });

  React.useEffect(() => {
    setFormData({
      name: lead.name || "",
      phone: lead.phone,
      location: lead.location || "",
      requirement: lead.requirement || "",
      status: lead.status,
      owner: lead.owner || "",
      notes: lead.notes || "",
      automationMode: lead.automationMode || "AUTO",
      label: lead.label || "UNKNOWN",
      conversationOwner: lead.conversationOwner || lead.automationMode || "AUTO",
    });
  }, [lead]);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    // basic validation
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, "");
    
    const res = await updateLeadDetailsAction(lead.phone, {
      ...formData,
      phone: cleanPhone
    });

    if (res.success) {
      setIsEditing(false);
      onUpdate({ ...lead, ...res.data });
      showToast("success", "Lead updated successfully!");
    } else {
      showToast("error", res.message || "Failed to update lead");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 transition-opacity" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Custom Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
            <div className={`px-4 py-2 rounded-lg shadow-lg text-sm font-bold flex items-center gap-2 ${
              toastMessage.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
            }`}>
              {toastMessage.type === "success" ? "✅" : "❌"} {toastMessage.text}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-100 bg-gray-50 flex-col sm:flex-row gap-4 sm:gap-0">
          <div>
            <h2 className="text-xl font-bold">{lead.name || "Unknown Lead"}</h2>
            <div className="flex gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${lead.automationMode === 'AUTO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {lead.automationMode}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
                Score: {lead.leadScore || 0}
              </span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer" className="p-2 text-green-600 hover:bg-green-50 rounded-full">
              <FaWhatsapp size={20} />
            </a>
            <a href={`tel:+${lead.phone}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <FaPhone size={18} />
            </a>
            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 sm:px-6 mt-2 space-x-6 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab("profile")} className={`py-3 text-sm font-medium border-b-2 ${activeTab === "profile" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Profile</button>
          <button onClick={() => setActiveTab("conversation")} className={`py-3 text-sm font-medium border-b-2 ${activeTab === "conversation" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Conversation</button>
          <button onClick={() => setActiveTab("timeline")} className={`py-3 text-sm font-medium border-b-2 ${activeTab === "timeline" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Timeline</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Lead Details</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="text-sm text-blue-600 font-medium">Edit</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500 font-medium">Cancel</button>
                    <button onClick={handleSave} disabled={loading} className="text-sm text-blue-600 font-medium">{loading ? "Saving..." : "Save"}</button>
                  </div>
                )}
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Name</label>
                    {isEditing ? <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded p-2 text-sm" /> : <div className="text-sm font-medium">{lead.name || "—"}</div>}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone</label>
                    {isEditing ? <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded p-2 text-sm" /> : <div className="text-sm font-medium">+{lead.phone}</div>}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Location</label>
                    {isEditing ? <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border rounded p-2 text-sm" /> : <div className="text-sm font-medium">{lead.location || "—"}</div>}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Owner</label>
                    {isEditing ? <input type="text" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className="w-full border rounded p-2 text-sm" /> : <div className="text-sm font-medium">{lead.owner || "Unassigned"}</div>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Requirement</label>
                  {isEditing ? <input type="text" value={formData.requirement} onChange={e => setFormData({...formData, requirement: e.target.value})} className="w-full border rounded p-2 text-sm" /> : <div className="text-sm font-medium">{lead.requirement || "—"}</div>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    {isEditing ? (
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border rounded p-2 text-sm">
                        {["NEW", "CONTACTED", "QUALIFIED", "SITE_VISIT", "QUOTE_SENT", "NEGOTIATION", "CONVERTED", "LOST"].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <div className="text-sm font-medium">{lead.status}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Conversation Owner</label>
                    {isEditing ? (
                      <select value={formData.conversationOwner} onChange={e => setFormData({...formData, conversationOwner: e.target.value as any})} className="w-full border rounded p-2 text-sm">
                        <option value="AUTO">🤖 AUTO</option>
                        <option value="MANUAL">🧑‍💻 MANUAL</option>
                      </select>
                    ) : (
                      <div className="text-sm font-medium">{lead.conversationOwner || lead.automationMode || "AUTO"}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Contact Label</label>
                    {isEditing ? (
                      <select value={formData.label} onChange={e => setFormData({...formData, label: e.target.value as any})} className="w-full border rounded p-2 text-sm">
                        {["UNKNOWN", "LEAD", "CLIENT", "RELATIVE", "VIP", "TEAM"].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    ) : (
                      <div className="text-sm font-medium">{lead.label || "UNKNOWN"}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Conversion Details</label>
                    <div className="text-sm font-medium text-gray-600">
                      {lead.convertedAt ? `Converted on ${new Date(lead.convertedAt).toLocaleDateString()}` : "Not converted yet"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Admin Notes</label>
                  {isEditing ? (
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border rounded p-2 text-sm" rows={3}></textarea>
                  ) : (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes || "No notes added."}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "conversation" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">WhatsApp History</h3>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                {lead.messages && lead.messages.length > 0 ? (
                  lead.messages.map((msg, idx) => {
                    const isUser = msg.startsWith("User:");
                    return (
                      <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${isUser ? "bg-green-100 text-green-900" : "bg-gray-100 text-gray-800"}`}>
                          <div className="font-bold text-xs mb-1 opacity-50">{isUser ? "User" : "CasaChic Bot"}</div>
                          {msg.replace(/^(User:|Bot:)/, "")}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500 text-sm text-center py-4">No conversation history.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Lead Timeline</h3>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative">
                <div className="absolute top-6 bottom-6 left-8 w-0.5 bg-gray-200"></div>
                <div className="space-y-6 relative">
                  {(lead.timeline || []).slice().reverse().map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-4 h-4 rounded-full bg-black mt-1 z-10 shrink-0"></div>
                      <div>
                        <div className="font-medium text-sm">{event.event}</div>
                        {event.details && <div className="text-gray-600 text-sm">{event.details}</div>}
                        <div className="text-gray-400 text-xs mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!lead.timeline || lead.timeline.length === 0) && (
                    <div className="text-gray-500 text-sm text-center">No timeline events recorded.</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
