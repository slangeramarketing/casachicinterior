'use client';
import React from 'react';
// React Icons
import { 
  FaMousePointer, FaEye, FaPlayCircle, FaDownload, 
  FaSignInAlt, FaTerminal, FaLink, FaLayerGroup 
} from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';

interface Props {
  data: any;
}

export default function EventDataTab({ data }: Props) {
  const events = data?.events || [];

  // Event name ke hisab se icon choose karne ka logic
  const getEventIcon = (name: string) => {
    const e = name.toLowerCase();
    if (e.includes('page_view')) return <FaEye className="text-blue-500" />;
    if (e.includes('click')) return <FaMousePointer className="text-orange-500" />;
    if (e.includes('session_start')) return <FaPlayCircle className="text-green-500" />;
    if (e.includes('download')) return <FaDownload className="text-purple-500" />;
    if (e.includes('first_visit')) return <FaSignInAlt className="text-red-500" />;
    if (e.includes('submit')) return <FaTerminal className="text-indigo-500" />;
    
    return <FaLayerGroup className="text-gray-400" />;
  };

  return (
    <div className="w-full grid grid-cols-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      {/* 1. Header Section */}
      <div className="w-full p-6 border-b border-gray-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-lg shadow-orange-100">
            <HiLightningBolt size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">User Activity by Page</h3>
            <p className="text-xs text-gray-400 font-medium">Real-time interaction breakdown</p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Stream: Active</span>
        </div>
      </div>

      {/* 2. Table Section */}
      <div className="w-full overflow-x-auto">
        <table className="md:w-full text-left border-collapse w-110">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-50">
              <th className="px-6 py-4 font-black">Interaction Type</th>
              <th className="px-6 py-4 font-black">Target Location</th>
              <th className="px-6 py-4 font-black text-right">Occurrence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.length > 0 ? (
              events.map((row: any, i: number) => {
                const eventName = row.dimensionValues?.[0]?.value || 'Unknown';
                const pagePath = row.dimensionValues?.[1]?.value || '/';
                const count = parseInt(row.metricValues?.[0]?.value || '0');

                return (
                  <tr key={i} className="group hover:bg-orange-50/30 transition-all duration-300">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                          {getEventIcon(eventName)}
                        </div>
                        <span className="text-sm text-gray-700 font-bold capitalize">
                          {eventName.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaLink className="text-gray-300 text-[10px]" />
                        <span className="text-[11px] text-blue-600 font-mono bg-blue-50/50 border border-blue-100 px-2 py-1 rounded-md group-hover:bg-blue-100 transition-colors">
                          {pagePath}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-800 font-black">
                          {count.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Actions</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FaTerminal className="text-gray-200 animate-pulse" size={30} />
                    <p className="text-gray-400 italic text-sm font-medium">Listening for live events... 📡</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Footer Stats (Optional Tip) */}
      <div className="bg-gray-50/50 p-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-gray-400">
          <FaMousePointer size={10} />
          <p className="text-[10px] font-bold uppercase tracking-widest">
            Events are synced every few minutes from GA4
          </p>
        </div>
      </div>
    </div>
  );
}