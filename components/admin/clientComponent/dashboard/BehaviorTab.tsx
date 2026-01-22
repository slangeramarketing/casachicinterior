'use client';
import React from 'react';
import { 
  FaDesktop, FaMobileAlt, FaFileAlt, FaHome, 
  FaProjectDiagram, FaInfoCircle, FaExternalLinkSquareAlt 
} from 'react-icons/fa';
import { HiChartBar } from 'react-icons/hi';

export default function BehaviorTab({ data }: { data: any }) {
  const pages = data?.behavior || [];
  const deviceData = data?.devices || [];
  
  // Device data extraction logic
  const desktopUsers = deviceData.find(
    (row: any) => row.dimensionValues[0].value.toLowerCase() === 'desktop'
  )?.metricValues[0].value || "0";

  const mobileUsers = deviceData.find(
    (row: any) => row.dimensionValues[0].value.toLowerCase() === 'mobile'
  )?.metricValues[0].value || "0";

  // Logic to find max views for progress bars
  const maxViews = pages.length > 0 
    ? Math.max(...pages.map((p: any) => parseInt(p.metricValues?.[0]?.value || '0'))) 
    : 1;

  // Function to assign icon based on page path
  const getPageIcon = (path: string) => {
    if (path === '/') return <FaHome className="text-blue-500" />;
    if (path.includes('project')) return <FaProjectDiagram className="text-orange-500" />;
    if (path.includes('about')) return <FaInfoCircle className="text-green-500" />;
    return <FaFileAlt className="text-gray-400" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
      
      {/* 📑 Top Visited Pages Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <HiChartBar size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-lg tracking-tight">Top Visited Pages</h4>
            <p className="text-xs text-gray-400 font-medium tracking-tight">Most popular parts of your portfolio</p>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          {pages.length > 0 ? (
            pages.slice(0, 6).map((row: any, index: number) => {
              const viewCount = parseInt(row.metricValues?.[0]?.value || '0');
              const percentage = (viewCount / maxViews) * 100;
              const path = row.dimensionValues?.[0]?.value;

              return (
                <div key={index} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      {getPageIcon(path)}
                      <span className="text-sm font-bold text-gray-700 truncate" title={path}>
                        {path === '/' ? 'Home / Index' : path}
                      </span>
                    </div>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {viewCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-50 h-2 rounded-full overflow-hidden border border-gray-100/50">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-10">
              <FaFileAlt className="text-gray-200 text-4xl mb-3" />
              <p className="text-gray-400 italic text-sm">No page data available yet...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 💻 Device Breakdown Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
        <div className="mb-4">
          <h4 className="font-bold text-gray-800 text-lg tracking-tight flex items-center gap-2">
            Device Engagement <FaExternalLinkSquareAlt size={14} className="text-gray-300" />
          </h4>
          <p className="text-xs text-gray-400 font-medium">Comparison of access points</p>
        </div>

        <div className="flex justify-around items-center py-12">
          {/* Desktop Visual */}
          <div className="text-center group flex flex-col items-center">
            <div className="mb-4 p-5 bg-gray-50 rounded-[2rem] group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-inner">
              <FaDesktop size={32} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Desktop</p>
            <h5 className="text-3xl font-black text-gray-800 mt-1 tracking-tighter">
              {parseInt(desktopUsers).toLocaleString()}
            </h5>
          </div>

          <div className="h-16 border-l border-gray-100"></div>

          {/* Mobile Visual */}
          <div className="text-center group flex flex-col items-center">
            <div className="mb-4 p-5 bg-gray-50 rounded-[2rem] group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-inner">
              <FaMobileAlt size={32} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile</p>
            <h5 className="text-3xl font-black text-gray-800 mt-1 tracking-tighter">
              {parseInt(mobileUsers).toLocaleString()}
            </h5>
          </div>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3 mt-4">
          <div className="bg-blue-500 text-white p-1 rounded-md mt-0.5">
            <FaInfoCircle size={10} />
          </div>
          <p className="text-[10px] text-blue-700 leading-relaxed font-bold">
            OPTIMIZATION TIP: {parseInt(mobileUsers) > parseInt(desktopUsers) 
              ? "Mobile traffic is leading! Double check your touch targets and mobile load speed." 
              : "Desktop usage is high. Ensure your hover effects and large-screen layouts are pixel perfect."}
          </p>
        </div>
      </div>

    </div>
  );
}