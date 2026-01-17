"use client";

import Image from "next/image";
import md5 from "md5";
import TableUi, { Column } from "@/components/common/TableUi";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import ConfirmActionDialog from "@/components/admin/ConfirmActionDialogProps";
import CreateButton from "@/components/common/CreateButton";
import { UserResponseDTO } from "@/modules/users/user.dto";
import { deleteUserAction } from "@/app/admin/actions/admin.users.action";

/* =========================
   GRAVATAR
========================= */
function getGravatar(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
}

/* =========================
   PROPS
========================= */
interface UsersClientPageProps {
  users: UserResponseDTO[];
}

/* =========================
   COMPONENT
========================= */
export default function UsersClientPage({
  users,
}: UsersClientPageProps) {

  const router = useRouter();


  async function handleDelete(userId: string) {
    await deleteUserAction(userId);
  }

  /* =========================
     COLUMNS
  ========================= */
  const columns: Column<UserResponseDTO>[] = [
    {
      key: "profile",
      label: "Profile",
      render: (row) => (
        <Image
          src={getGravatar(row.email)}
          alt={row.name || "User"}
          width={40}
          height={40}
          className="rounded-full border"
        />
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/users/update/${row.id}`)}
          >
            <MdEdit size={20} />
          </button>

          <ConfirmActionDialog
            title="Delete User"
            description="This User will be permanently deleted. This action cannot be undone."
            confirmText="Delete"
            danger
            action={() => handleDelete(row.id)}
            trigger={
                <button
                title="Delete"
                className="p-2 rounded-md text-red-600 hover:bg-red-100 transition"
                >
                <RiDeleteBin6Line size={20} />
                </button>
            }
            />
        </div>
      ),
    },
  ];

  return (
    <div className="px-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <PageRouteHeader />
        <SearchInput />
      </div>

      <div className="flex justify-between items-center">
        <PageTitle
        title="Users"
        description="Manage your application users"
        />

        <CreateButton label="Add" className="text-white py-4" onClick={()=> router.push('/admin/users/create')} />
      </div>

      {/* Table */}
      <TableUi<UserResponseDTO> columns={columns} data={users} />
    </div>
  );
}
