"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserAction,updateUserBySuperAdminAction } from "@/app/actions/users.action";
import type {
  UserResponseDTO,
  UserRole,
  UserStatus,
} from "@/modules/users/user.dto";
import Alert, { AlertType } from "@/components/common/Alert";
import ProfileImageUpload from "@/components/common/ProfileImageUpload";
import { uploadImage } from "@/lib/uploadImage";
import { SelectField } from "@/components/common/FormField";

/* =========================
   TYPES
========================= */
type UserFormState = {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  profile?: string;
  status: UserStatus;
};

interface UserFormProps {
  mode: "create" | "update";
  initialData?: Omit<UserResponseDTO, "password">;
}

/* =========================
   COMPONENT
========================= */
export default function UserForm({
  mode,
  initialData,
}: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const userId = initialData?.id ?? "";

  /* =========================
     FORM STATE (TYPE SAFE)
  ========================= */
  const [form, setForm] = useState<UserFormState>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    password: "",
    role: initialData?.role,
    profile: initialData?.profile,
    status: initialData?.status ?? "active",
  });

  /* =========================
     HANDLERS
  ========================= */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    let profileUrl = initialData?.profile;

    // Upload profile image if selected
    if (profileFile) {
      profileUrl = await uploadImage(profileFile, "profile");
    }

    if (mode === "create") {
      if (!form.password) {
        throw new Error("Password is required");
      }

      await createUserAction({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        status: form.status,
        profile: profileUrl,
      });
    } else {
      // 🔐 SUPER ADMIN FULL UPDATE
      await updateUserBySuperAdminAction(userId, {
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        profile: profileUrl,
      });
    }

    router.push("/admin/users");
  } catch (error: any) {
    setAlert({
      type: "error",
      title: "Something went wrong",
      message: error?.message || "Please try again.",
    });
  } finally {
    setLoading(false);
  }
}


  /* =========================
     UI
  ========================= */
  return (
    <div className="flex flex-col w-full items-center px-10">
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
        className="max-w-xl w-full rounded-xl border border-gray-300 bg-white px-8 py-8"
      >
        <div className="space-y-6">
          <ProfileImageUpload
            value={initialData?.profile}
            onChange={(file) => setProfileFile(file)}
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />

          {mode === "create" && (
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          )}

          <select
            name="role"
            value={form.role ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                role: e.target.value as UserRole,
              }))
            }
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">Select role</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
          </select>

          <SelectField
            label="Account Status"
            name="status"
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                status: e.target.value as UserStatus,
              }))
            }
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Blocked", value: "blocked" },
            ]}
          />
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded bg-bg-primary text-white py-2 disabled:opacity-60"
        >
          {mode === "create" ? "Create User" : "Update User"}
        </button>
      </form>
    </div>
  );
}
