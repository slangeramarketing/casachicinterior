"use client";

import { useState } from "react";
import md5 from "md5";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import ProfileImageUpload from "@/components/common/ProfileImageUpload";
import { SelectField, TextField } from "@/components/common/FormField";
import { BiEdit } from "react-icons/bi";
import { uploadImage } from "@/lib/uploadImage";
import { updateSelfProfileAction,updateUserBySuperAdminAction } from "@/app/actions/users.action";
import Alert, { AlertType } from "@/components/common/Alert";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";

/* =========================
   TYPES
========================= */
type UserStatus = "active" | "inactive" | "blocked";
type UserRole = "super_admin" | "admin";

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile?: string;
  status: UserStatus;
}

/* =========================
   HELPERS
========================= */
function getGravatar(email: string) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=400`;
}

/* =========================
   COMPONENT
========================= */
export default function ProfilePage({ user }: { user: ProfileUser }) {
  const [editMode, setEditMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [saving, setSaving] = useState(false);
  const isAdmin = user.role === "admin";



  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });

  const [profileFile, setProfileFile] = useState<File | null>(null);

  const profileSrc =
    user.profile && user.profile.trim() !== ""
      ? user.profile
      : getGravatar(user.email);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

async function handleSave() {
  setSaving(true);

  try {
    let profileUrl = user.profile;

    // Upload image if changed
    if (profileFile) {
      profileUrl = await uploadImage(profileFile, "profile");
    }

    // Basic validation
    if (!form.name.trim()) {
      throw new Error("Name is required");
    }

    if (!isAdmin && !form.email.trim()) {
      throw new Error("Email is required");
    }

    if (isAdmin) {
      // 🔒 ADMIN → SELF UPDATE ONLY
      await updateSelfProfileAction({
        name: form.name,
        profile: profileUrl,
      });
    } else {
      // 🔐 SUPER ADMIN → FULL UPDATE
      await updateUserBySuperAdminAction(user.id, {
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        profile: profileUrl,
      });
    }

    setAlert({
      type: "success",
      title: "Profile updated",
      message: "Your profile changes have been saved successfully.",
    });

    setEditMode(false);
  } catch (error: any) {
    setAlert({
      type: "error",
      title: "Update failed",
      message: error?.message || "Please check the form and try again.",
    });
  } finally {
    setSaving(false);
  }
}



  return (
    <div className="bg-gray-50 px-6 py-12 grid grid-cols-1 justify-center items-center justify-items-center">
      <div className="flex flex-col justify-self-start">
        <PageRouteHeader/>
        <PageTitle title="Profile Page" description="Your Detail profile data "/>
      </div>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow border border-gray-300 p-8 relative">

        {/* HEADER */}
        <div className="grid grid-cols-1 gap-8 items-center">

          {/* PROFILE IMAGE */}
          <div className="flex justify-center items-center">
           {!editMode &&(
            <button onClick={() => setPreviewOpen(true)}>
              <OptimizedImage
                src={profileSrc}
                alt={form.name}
                width={120}
                height={120}
                className="rounded-full border object-cover hover:opacity-90 transition"
              />
            </button>
           )}

            {editMode && (
              <div>
                <ProfileImageUpload
                  value={profileSrc}
                  onChange={(file) => setProfileFile(file)}
                />
              </div>
            )}
          </div>

          {/* BASIC INFO */}
          <div className="flex-1 w-full">
            {!editMode ? (
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {form.name}
                </h1>
                <p className="text-gray-500">{form.email}</p>

                <div className="flex gap-2 mt-3 justify-center">
                  <Badge label={form.role} />
                  <StatusBadge status={form.status} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {alert && (
                  <div className="mb-6">
                    <Alert
                      type={alert.type}
                      title={alert.title}
                      message={alert.message}
                      onClose={() => setAlert(null)}
                    />
                  </div>
                )}

                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />

                <TextField
                  label="Email Address"
                  type="email"
                  name="email"
                  disabled={isAdmin}
                  value={form.email}
                  onChange={handleChange}
                  className={isAdmin
                    ? "bg-gray-400 cursor-not-allowed"
                    : "cursor-pointer"
                  }
                />

                <SelectField
                  label="Role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={isAdmin}
                  options={[
                    { label: "Super Admin", value: "super_admin" },
                    { label: "Admin", value: "admin" },
                  ]}
                  className={isAdmin
                    ? "bg-gray-400 cursor-not-allowed"
                    : "cursor-pointer"
                  }
                />

                <SelectField
                  label="Account Status"
                  name="status"
                  value={form.status}
                  disabled={isAdmin}
                  onChange={handleChange}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                    { label: "Blocked", value: "blocked" },
                  ]}
                  className={isAdmin
                    ? "bg-gray-400 cursor-not-allowed"
                    : "cursor-pointer"
                  }
                />

                {isAdmin && (
                  <p className="text-xs text-gray-400">
                    Some fields are restricted for Admin accounts.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ACTION */}
          <div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 rounded border-none bg-none text-white text-sm absolute top-0 right-5 cursor-pointer"
              >
                <BiEdit color="black" size={20} />
              </button>
            ) : (
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded bg-green-600 text-white text-sm disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 rounded bg-gray-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔍 IMAGE PREVIEW */}
      {previewOpen && (
        <div
          onClick={() => setPreviewOpen(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-md"
        >
          <OptimizedImage
            src={profileSrc}
            alt="Profile Preview"
            width={360}
            height={360}
            className="rounded-full border-4 border-white object-cover"
          />
        </div>
      )}
    </div>
  );
}

/* =========================
   UI PARTS
========================= */
function Badge({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
      {label.replace("_", " ")}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const color =
    status === "active"
      ? "bg-green-100 text-green-700"
      : status === "blocked"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-3 py-1 text-xs rounded-full capitalize ${color}`}>
      {status}
    </span>
  );
}
