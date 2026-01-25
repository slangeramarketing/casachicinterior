"use client";


import { OptimizedImage } from "@/components/common/OptimizedImage";
import md5 from "md5";

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
  status: UserStatus;
}

/* =========================
   HELPERS
========================= */
function getGravatar(email: string) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=300`;
}

/* =========================
   COMPONENT
========================= */
export default function ProfilePage({ user }: { user: ProfileUser }) {
  return (
    <div className="min-h-[570px] bg-gray-50 px-6 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow border border-gray-300 p-8">

        {/* HEADER */}
        <div className="flex md:flex-row flex-col justify-center md:justify-items-start items-center gap-6">
          <OptimizedImage
            src={getGravatar(user.email)}
            alt={user.name}
            width={96}
            height={96}
            className="rounded-full border"
          />

          <div className="flex flex-col justify-center md:justify-items-start items-center md:items-start">
            <h1 className="text-sm md:text-2xl font-semibold text-gray-800">
              {user.name}
            </h1>

            <p className="text-gray-500 text-xs md:text-lg">{user.email}</p>

            <div className="flex gap-2 mt-2">
              <Badge label={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-8 border-t" />

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info label="Full Name" value={user.name} />
          <Info label="Email Address" value={user.email} />
          <Info label="Role" value={user.role} />
          <Info label="Account Status" value={user.status} />
        </div>
      </div>
    </div>
  );
}

/* =========================
   UI PARTS
========================= */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <p className="mt-1 text-gray-800 font-medium">{value}</p>
    </div>
  );
}

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
