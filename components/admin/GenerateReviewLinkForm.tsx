"use client";

import { useState } from "react";
import CreateButton from "@/components/common/CreateButton";

type ProjectOption = {
  id: string;
  title: string;
};

type ClientOption = {
  id: string;
  name: string;
  email: string;
};

interface Props {
  projects: ProjectOption[];
  clients: ClientOption[];
}

export default function GenerateReviewLinkForm({
  projects,
  clients,
}: Props) {
  const [projectId, setProjectId] = useState("");
  const [clientId, setClientId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  function generateLink() {
    if (!projectId || !clientId) return;

    const token = crypto.randomUUID();
    const link = `${window.location.origin}/review/submit?token=${token}`;
    setGeneratedLink(link);
  }

  function copyLink() {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    alert("Review link copied");
  }

  function sendMail() {
    if (!generatedLink) return;

    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const subject = "Share Your Review – Casachic Interior";
    const body = `Hi ${client.name},

Thank you for choosing Casachic Interior.
Please share your experience using the link below:

${generatedLink}

Regards,
Casachic Interior`;

    window.location.href = `mailto:${client.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="max-w-xl bg-white border rounded-2xl p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">
        Generate Review Link
      </h2>

      {/* PROJECT */}
      <div>
        <label className="text-sm text-gray-600">Select Project</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full mt-1 border rounded-md px-3 py-2"
        >
          <option value="">-- Select Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* CLIENT */}
      <div>
        <label className="text-sm text-gray-600">Select Client</label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full mt-1 border rounded-md px-3 py-2"
        >
          <option value="">-- Select Client --</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
      </div>

      {/* GENERATE */}
      <CreateButton
        label="Generate Review Link"
        className="w-full"
        onClick={generateLink}
      />

      {/* LINK OUTPUT */}
      {generatedLink && (
        <div className="space-y-3">
          <input
            value={generatedLink}
            readOnly
            className="w-full border rounded-md px-3 py-2 text-sm bg-gray-50"
          />

          <div className="flex gap-3">
            <button
              onClick={copyLink}
              className="flex-1 border rounded-md py-2 text-sm hover:bg-gray-100"
            >
              Copy Link
            </button>

            <button
              onClick={sendMail}
              className="flex-1 bg-orange-500 text-white rounded-md py-2 text-sm hover:bg-orange-600"
            >
              Send via Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
