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
      <div className="text-center py-10 text-gray-400 border rounded-lg">
        No records found
      </div>
    );
  }

  return (
    /* 1. w-full aur overflow-x-auto ensure karta hai ki parent container scroll ho */
    <div className="w-110 sm:w-180 lg:w-full overflow-x-auto rounded-xl border border-gray-200">
      
      {/* 2. min-w-max ya min-w-[600px] use karein taaki columns collapse na hon */}
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 font-semibold whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition">
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