"use client";

/***************************************************
 * File: components/admin/clientComponent/review/ReviewForm.tsx
 * Layer: Client Component
 *
 * Purpose:
 * - Generate review link (admin)
 * - Update / moderate review (admin)
 *
 * Responsibilities:
 * - Collect input
 * - Validate input
 * - Trigger server actions
 *
 * Restrictions:
 * - Must NOT fetch data
 ***************************************************/

import { useState } from "react";
import Alert, { AlertType } from "@/components/common/Alert";
import {
  TextField,
  SelectField,
  TextAreaField,
} from "@/components/common/FormField";
import { FiLink, FiCopy, FiCheck } from "react-icons/fi";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import {
  createReviewLink,
  moderateReviewAction,
} from "@/app/actions/review.action";

/* ===============================================
   Types
   =============================================== */

type ReviewFormMode = "create" | "update";

interface ServiceOption {
  id: string;
  name: string;
}

interface ReviewFormProps {
  mode: ReviewFormMode;
  services?: ServiceOption[];

  // only for update mode
  reviewData?: {
    id: string;
    status: "pending" | "approved" | "rejected";
    isFeatured: boolean;
    adminResponse?: string;
    clientLocation?: string;
  };
}

/* ===============================================
   Component
   =============================================== */

export default function ReviewForm({
  mode,
  services = [],
  reviewData,
}: ReviewFormProps) {
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- CREATE MODE STATE ---------- */
  const [createData, setCreateData] = useState({
    clientName: "",
    clientEmail: "",
    serviceId: "",
    submissionSource: "email" as "email" | "direct_link",
    clientLocation: "",
  });

  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  /* ---------- UPDATE MODE STATE ---------- */
  const [updateData, setUpdateData] = useState({
    status: reviewData?.status ?? "pending",
    isFeatured: reviewData?.isFeatured ?? false,
    adminResponse: reviewData?.adminResponse ?? "",
    clientLocation: reviewData?.clientLocation ?? "",
  });

  /* ===============================================
     Submit Handler
     =============================================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    try {
      setLoading(true);

      /* ---------- CREATE MODE ---------- */
      if (mode === "create") {
        const res = await createReviewLink({
          clientName: createData.clientName,
          clientEmail:
            createData.submissionSource === "email"
              ? createData.clientEmail
              : undefined,
          serviceId: createData.serviceId,
          submissionSource: createData.submissionSource,
          clientLocation:createData.clientLocation,
        });

        if (!res.emailed) {
          setGeneratedLink(res.reviewLink);
        }

        setAlert({
          type: "success",
          title: "Review link created",
          message: res.emailed
            ? "Review link has been emailed to the client."
            : "You can copy and share the review link.",
        });
      }

      /* ---------- UPDATE MODE ---------- */
      if (mode === "update" && reviewData) {
        await moderateReviewAction(reviewData.id, {
          status: updateData.status,
          isFeatured: updateData.isFeatured,
          adminResponse: updateData.adminResponse,
          clientLocation: updateData.clientLocation,
        });

        setAlert({
          type: "success",
          title: "Review updated",
          message: "Review moderation updated successfully.",
        });
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        title: "Action failed",
        message: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ===============================================
     UI
     =============================================== */

  return (
    <>
      <PageRouteHeader />
      <PageTitle
        title={mode === "create" ? "Generate Review Link" : "Update Review"}
        description={
          mode === "create"
            ? "Generate a secure review link for your client"
            : "Approve, reject or feature this review"
        }
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-6 space-y-6 shadow-sm"
        >
          {/* ================= CREATE MODE ================= */}
          {mode === "create" && (
            <>
              <TextField
                label="Client Name"
                value={createData.clientName}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    clientName: e.target.value,
                  })
                }
                placeholder="Aman Sharma"
              />

              <TextField
                label="Client Location (optional)"
                value={createData.clientLocation}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    clientLocation: e.target.value,
                  })
                }
                placeholder="Mumbai, Andheri West"
              />

              <SelectField
                label="Service"
                value={createData.serviceId}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    serviceId: e.target.value,
                  })
                }
                options={services.map((s) => ({
                  label: s.name,
                  value: s.id,
                }))}
              />

              <SelectField
                label="Link Type"
                value={createData.submissionSource}
                onChange={(e) =>
                  setCreateData({
                    ...createData,
                    submissionSource: e.target.value as any,
                  })
                }
                options={[
                  { label: "Send via Email", value: "email" },
                  { label: "Direct / WhatsApp Link", value: "direct_link" },
                ]}
              />

              {createData.submissionSource === "email" && (
                <TextField
                  label="Client Email"
                  type="email"
                  value={createData.clientEmail}
                  onChange={(e) =>
                    setCreateData({
                      ...createData,
                      clientEmail: e.target.value,
                    })
                  }
                  placeholder="aman@example.com"
                />
              )}
            </>
          )}

          {/* ================= UPDATE MODE ================= */}
          {mode === "update" && (
            <>
              <SelectField
                label="Review Status"
                value={updateData.status}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    status: e.target.value as any,
                  })
                }
                options={[
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                ]}
              />

              <SelectField
                label="Featured Review"
                value={updateData.isFeatured ? "yes" : "no"}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    isFeatured: e.target.value === "yes",
                  })
                }
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
              />

              <TextField
                label="Client Location (optional)"
                value={updateData.clientLocation}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    clientLocation: e.target.value,
                  })
                }
                placeholder="Mumbai, Andheri West"
              />

              <TextAreaField
                label="Admin Response"
                value={updateData.adminResponse}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    adminResponse: e.target.value,
                  })
                }
                maxLength={500}
              />
            </>
          )}

          {/* ================= SUBMIT ================= */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-bg-primary text-white py-3 rounded-md disabled:opacity-50"
          >
            <FiLink />
            {loading
              ? "Processing..."
              : mode === "create"
              ? "Generate Review Link"
              : "Update Review"}
          </button>

          {/* ================= COPY LINK ================= */}
          {generatedLink && (
            <div className="border rounded-md p-4 bg-gray-50 space-y-2">
              <p className="text-xs font-medium text-gray-600">
                Generated Review Link
              </p>

              <div className="flex gap-2">
                <input
                  readOnly
                  value={generatedLink}
                  className="flex-1 text-xs px-3 py-2 border rounded-md bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="px-4 border rounded-md text-sm"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
