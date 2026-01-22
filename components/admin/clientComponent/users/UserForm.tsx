"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserAction, updateUserAction } from "@/app/actions/users.action";
import { UserCreateDTO, UserResponseDTO } from "@/modules/users/user.dto";
import Alert, { AlertType } from "@/components/common/Alert";


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
  const id=initialData?.id || "";

  const [alert,setAlert]=useState<AlertType | null>(null);

  const [form, setForm] = useState<UserCreateDTO>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role,
    password: "",
  });

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        await createUserAction({
          name: form.name,
          email: form.email,
          password: form.password!,
          role: form.role,
        });

        setAlert({
          type: "success",
          title: "User created successfully",
          message: "The new user has been created.",
        })
            // handleSubmit ke andar update logic ko aise change karein:
      } else {
        // Password ko update payload se delete kar dein
        const { password, ...updateData } = form; 
        
        await updateUserAction(
          id,
          updateData // Ab sirf name, email, aur role jayega
        );
        // ... rest of the code
      }

      router.push("/admin/users");
    } catch (error: any) {
      setAlert({
        type: "error",
        title: "Something went wrong",
        message: error?.message || "Please try again.",
      })
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="flex flex-col w-full items-center px-10">
 
     {alert && (
      <Alert 
         type={alert?.type || "success"}
         title={alert?.title || ""}
         message={alert?.message}
         onClose={() => setAlert(null)}
      />
     )}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full rounded-xl border border-gray-300 bg-white px-8 py-18"
      >
        <div className="space-y-6">
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
            className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
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
            value={form.role}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded bg-bg-primary text-white py-2"
        >
          {mode === "create" ? "Create User" : "Update User"}
        </button>
      </form>
    </div>
  );
}
