'use client';
import React from 'react';
import AnalyticsMap from './AnalyticsMap';
// React Icons (Fixed Imports)
import { FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaSatellite } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';

interface Props {
  data: any;
}

export default function GeoDataTab({ data }: Props) {
  const locations = data?.geo || [];

  const maxUsers = locations.length > 0 
    ? Math.max(...locations.map((loc: any) => parseInt(loc.metricValues?.[0]?.value || '0'))) 
    : 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600">
            <FaGlobeAmericas size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">Users by Location</h3>
            <p className="text-xs text-gray-400 font-medium">Which cities are your visitors from?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-green-700 uppercase">Live Sync</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest">
              <th className="px-6 py-4 font-black">City Location</th>
              <th className="px-6 py-4 font-black text-right">Active Users</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {locations.length > 0 ? (
              locations.slice(0, 10).map((row: any, i: number) => {
                const cityName = row.dimensionValues?.[0]?.value || 'Unknown';
                const userCount = parseInt(row.metricValues?.[0]?.value || '0');
                const percentage = (userCount / maxUsers) * 100;

                return (
                  <tr key={i} className="group hover:bg-orange-50/40 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="text-gray-300 group-hover:text-orange-400 transition-colors">
                          <FaCity size={14} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 font-bold group-hover:text-gray-900 transition-colors">
                              {cityName === '(not set)' ? 'Other Regions' : cityName}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-1000 ease-out" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-base text-gray-800 font-black tracking-tighter">
                          {userCount.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-orange-500 uppercase tracking-tighter">
                          <HiLocationMarker /> Visitor
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <FaSatellite className="text-gray-200 animate-pulse" size={32} />
                    <p className="text-gray-400 italic text-sm font-medium">
                      Waiting for incoming signals... 📡
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-orange-50/10">
        <div className="bg-white rounded-2xl border border-orange-100 shadow-inner overflow-hidden relative">
          <AnalyticsMap data={data} />
        </div>
      </div>
    </div>
  );
}