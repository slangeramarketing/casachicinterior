import React from "react";

export default function LimitsTab({ limitEvents }: { limitEvents: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Quota Exceeded & Limits Logs</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">User (Phone)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Provider</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Usage vs Limit</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {limitEvents.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {log.phone || "SYSTEM"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="font-medium text-gray-800">{log.provider}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.usage && log.limit ? (
                      <span className="text-red-600 font-bold">{log.usage.toLocaleString()} / {log.limit.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full font-medium bg-red-100 text-red-700">
                      {log.reason}
                    </span>
                  </td>
                </tr>
              ))}
              {limitEvents.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No limit violations recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
