"use client";

import React from "react";

export type Column<T> = {
  key: keyof T | "action" | "profile";
  label: string;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
}

export default function TableUi<T extends { id: string | number }>({
  columns,
  data,
}: DataTableProps<T>) {

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 border rounded-xl">
        No records found
      </div>
    );
  }

  return (
    /* Scroll container */
    <div className="grid grid-cols-1 scrollbar-thin overflow-x-auto rounded-xl border border-gray-200">
      
      {/* min-w ensures horizontal scroll on small screens */}
      <table className="min-w-[700px] w-full border-collapse text-sm">
        
        {/* HEADER */}
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left font-semibold whitespace-nowrap border-b"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y">
          {data.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-4 py-3 whitespace-nowrap text-gray-600"
                >
                  {col.render
                    ? col.render(row)
                    : col.key === "action" || col.key === "profile"
                    ? null
                    : (row[col.key as keyof T] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
