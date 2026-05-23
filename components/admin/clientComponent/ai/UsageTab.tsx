import React, { useState } from "react";

export default function UsageTab({ initialUsage }: { initialUsage: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(initialUsage.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsage = initialUsage.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">API Usage & Logs</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">User (Phone)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap">Provider / Model</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap text-right">Tokens (Req/Res)</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap text-right">Latency</th>
                <th className="px-6 py-4 font-semibold text-gray-600 whitespace-nowrap text-right">Est. Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsage.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {log.phone}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="font-medium text-gray-800">{log.provider}</div>
                    <div className="text-xs truncate max-w-[150px]">{log.model}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="font-bold text-gray-900">{log.totalTokens}</span>
                    <div className="text-xs text-gray-400">{log.requestTokens} / {log.responseTokens}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className={`font-medium ${log.latency > 5000 ? 'text-red-500' : 'text-green-600'}`}>
                      {(log.latency / 1000).toFixed(2)}s
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap font-medium">
                    {log.estimatedCost ? `₹${(log.estimatedCost * 83.5).toFixed(4)}` : "₹0.0000"}
                  </td>
                </tr>
              ))}
              {paginatedUsage.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No usage logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {initialUsage.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, initialUsage.length)}</span> of <span className="font-medium">{initialUsage.length}</span> entries
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
