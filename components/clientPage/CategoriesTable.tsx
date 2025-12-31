"use client";

import { CategoryDTO } from "@/types/category";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { PageRouteHeader } from "../common/PageHeader";
import CreateButton from "../common/CreateButton";
import { useRouter } from "next/navigation";
import ConfirmActionDialog from "../admin/ConfirmActionDialogProps";
import { deleteCategoryAction } from "@/modules/category/category.actions";

interface Props {
  categories: CategoryDTO[];
}

export default function CategoriesTable({ categories }: Props) {
    const router=useRouter();
  return (
    <div className="space-y-6">

      {/* ================= Header ================= */}
      <div className="flex flex-col gap-1">
        <div>
            <PageRouteHeader/>
        </div>
       <div className="flex justify-between items-center">
         <div>
            <h1 className="text-xl font-semibold text-gray-800">
            Categories
            </h1>
            <p className="text-sm text-gray-500">
            Manage all blog categories from here
            </p>
         </div>
         <CreateButton label="New" onClick={()=>router.replace('/admin/blogs/categories/create')} className="text-white py-4 px-4" />
       </div>
      </div>

      {/* ================= Table ================= */}
      <div className="bg-white border rounded overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr className="text-gray-600 uppercase text-xs tracking-wide">
                <th className="text-left px-6 py-3 font-bold">
                  Name
                </th>
                <th className="text-left px-6 py-3 font-bold">
                  Slug
                </th>
                <th className="text-left px-6 py-3 font-bold">
                  Created
                </th>
                <th className="text-left px-6 py-3 font-bold">
                  Status
                </th>
                <th className="text-right px-6 py-3 font-bold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat, index) => (
                <tr
                  key={cat._id}
                  className={`
                    border-b last:border-none
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    hover:bg-orange-50 transition
                  `}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.name}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4">
                    {cat.isActive ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        <span className="h-2 w-2 rounded-full bg-green-600"></span>
                        Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                        <span className="h-2 w-2 rounded-full bg-red-600"></span>
                        Inactive
                        </span>
                    )}
                  </td>


                  <td className="px-6 py-4 text-gray-500">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        title="Edit"
                        className="p-2 rounded-md text-blue-600 hover:bg-blue-100 transition"
                        onClick={() =>
                          router.push(`/admin/blogs/categories/update/${cat._id}`)
                        }
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <ConfirmActionDialog
                        title="Delete Category"
                        description="This category will be permanently deleted. This action cannot be undone."
                        confirmText="Delete"
                        danger
                        action={() => deleteCategoryAction(cat._id)}
                        trigger={
                            <button
                            title="Delete"
                            className="p-2 rounded-md text-red-600 hover:bg-red-100 transition"
                            >
                            <FiTrash2 size={16} />
                            </button>
                        }
                        />

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
