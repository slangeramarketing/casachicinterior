'use client';
import React from 'react';

interface Props {
  data: any; // GA4 API ka response
}

export default function OverviewTab({ data }: Props) {
  // Real data parsing (example)
  const activeUsers = data?.rows?.[0]?.metricValues?.[0]?.value || "0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Users</p>
          <h3 className="text-3xl font-black text-gray-800 mt-2">{activeUsers}</h3>
          <p className="text-green-500 text-xs font-bold mt-1">↑ Live data</p>
        </div>
        
        {/* Card 2: Placeholder for Sessions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Sessions</p>
          <h3 className="text-3xl font-black text-gray-800 mt-2">--</h3>
          <p className="text-gray-400 text-xs mt-1">Calculating...</p>
        </div>

        {/* Card 3: Placeholder for Bounce Rate */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Engagement Rate</p>
          <h3 className="text-3xl font-black text-gray-800 mt-2">--%</h3>
        </div>
      </div>

      {/* Big Chart Placeholder */}
      <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-4xl mb-2">📈</span>
        <p className="text-gray-400 italic text-sm">User Trend Chart will be here</p>
      </div>
    </div>
  );
}