"use client";

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
import { deleteUserAction } from "@/app/actions/users.action";
import { formatDateTime } from "@/lib/utils/formatDateTime";
import { OptimizedImage } from "@/components/common/OptimizedImage";

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
        <OptimizedImage
          src={
            row.profile && row.profile.trim() !== ""
              ? row.profile
              : getGravatar(row.email)
          }
          alt={row.name || "User"}
          width={40}
          height={40}
          className="rounded-full border object-cover"
        />
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    // 2. updatedAt column ko render function ke saath update karein
    { 
      key: "updatedAt", 
      label: "Last-Update",
      render: (row) => (
        <span className="text-gray-500">
          {row.updatedAt ? formatDateTime(row.updatedAt) : "N/A"}
        </span>
      )
    },
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
    <div className="lg:px-10 w-full gap-4 flex flex-col">
      {/* Header */}
      <div className="w-full flex md:flex-row flex-col justify-between items-center gap-4 md:gap-0">
        <div className="w-full md:w-auto">
          <PageRouteHeader />
        </div>
        <div className="w-full md:w-auto">
          <SearchInput />
        </div>
        
      </div>

      <div className="flex justify-between items-center w-full">
        <PageTitle
        title="Users"
        description="Manage your application users"
        />

        <CreateButton label="Add" className="text-white py-4" onClick={()=> router.push('/admin/users/create')} />
      </div>

      {/* Table */}
      <div className="w-full">
         <TableUi<UserResponseDTO> columns={columns} data={users} />
      </div>
    </div>
  );
}
