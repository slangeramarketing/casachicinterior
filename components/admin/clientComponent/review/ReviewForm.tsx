"use client";

/***************************************************
 * File: components/admin/clientComponent/review/ReviewForm.tsx
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
import ProfileImageUpload from "@/components/common/ProfileImageUpload";
import { uploadImage } from "@/lib/uploadImage";

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

  reviewData?: {
    id: string;
    status: "pending" | "approved" | "rejected";
    isFeatured: boolean;
    adminResponse?: string;
    clientLocation?: string;
    clientAvatar?: string;
    clientEmail?:string;
    message?:string;
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

  console.log("Single Review Data: ",reviewData);

  /* ---------- AVATAR STATE ---------- */
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    reviewData?.clientAvatar || ""
  );

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
    clientEmail:reviewData?.clientEmail ?? ""
  });

  /* ===============================================
     Submit Handler
  =============================================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    try {
      setLoading(true);

      let uploadedAvatarUrl = avatarUrl;

      if (avatarFile) {
        uploadedAvatarUrl = await uploadImage(avatarFile, "profile");
      }

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
          clientLocation: createData.clientLocation,
          clientAvatar: uploadedAvatarUrl || undefined,
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
          clientAvatar: uploadedAvatarUrl || undefined,
          clientEmail: updateData.clientEmail
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
    <div className="py-6 px-4">
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
          className="bg-white border border-gray-300 rounded-xl p-6 space-y-6 shadow-sm"
        >
          {/* ---------- AVATAR ---------- */}
          <ProfileImageUpload
            value={avatarUrl}
            onChange={(file) => setAvatarFile(file)}
          />

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
              />
              <TextField
                label="Client Email (optional)"
                type="email"
                value={updateData.clientEmail}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    clientEmail: e.target.value,
                  })
                }
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

          {/* ---------- SUBMIT ---------- */}
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

          {/* ---------- COPY LINK ---------- */}
          {generatedLink && (
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">
                  Generated Review Link
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="p-2 border border-gray-300 rounded-md text-sm"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
              <input
                readOnly
                value={generatedLink}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
