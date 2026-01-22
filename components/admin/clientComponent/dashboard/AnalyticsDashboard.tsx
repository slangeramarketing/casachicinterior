'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// React Icons Imports
import { 
  FaChartLine, FaShareAlt, FaGlobe, FaMousePointer, 
  FaUserFriends, FaDownload, 
  FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaRobot, 
  FaFilePdf, FaBars
} from 'react-icons/fa';

import TrafficTab from './TrafficTab';
import BehaviorTab from './BehaviorTab';
import GeoDataTab from './GeoDataTab';
import EventDataTab from './EventDataTab';
import ReferrerTab from './ReferrerTab';

export default function AnalyticsDashboard({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const tabs = [
    { name: 'Overview', icon: <FaChartLine /> },
    { name: 'Traffic Sources', icon: <FaShareAlt /> },
    { name: 'Referrers', icon: <FaGlobe /> },
    { name: 'User Behavior', icon: <FaMousePointer /> },
    { name: 'Geo Data', icon: <FaGlobe /> },
    { name: 'Event Tab', icon: <FaUserFriends /> },
  ];

  // --- ⚡ Real Data Logic ---
  const referrers = data?.referrers || [];
  const overviewRows = data?.overview || [];

  const totalActiveUsers = overviewRows.reduce((acc: number, curr: any) => acc + parseInt(curr.metricValues?.[0]?.value || '0'), 0);
  const totalSessions = overviewRows.reduce((acc: number, curr: any) => acc + parseInt(curr.metricValues?.[1]?.value || '0'), 0);

  const chartData = overviewRows.map((row: any) => {
    const rawDate = row.dimensionValues?.[0]?.value; 
    const formattedDate = rawDate ? `${rawDate.substring(6, 8)}/${rawDate.substring(4, 6)}` : 'N/A';
    return { name: formattedDate, users: parseInt(row.metricValues?.[0]?.value || '0') };
  }).reverse();

  // --- 🤖 AI Insights ---
  const getInsight = () => {
    if (referrers.length === 0) return { text: "Waiting for traffic...", icon: <FaRobot /> };
    const topSourceRow = referrers.reduce((prev: any, current: any) => {
      const prevVal = parseInt(prev?.metricValues?.[0]?.value || '0');
      const currVal = parseInt(current?.metricValues?.[0]?.value || '0');
      return (prevVal > currVal) ? prev : current;
    }, referrers[0]);
    const source = topSourceRow?.dimensionValues?.[0]?.value?.toLowerCase() || '';
    return { text: `Analysis: Top source is ${source}`, icon: <FaRobot className="text-xl md:text-2xl" /> };
  };

  const insight = getInsight();

  // Export functions remain same as before...
  const exportToCSV = () => { /* ... existing logic ... */ };
  const exportToPDF = () => { /* ... existing logic ... */ };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Header Section - Responsive Padding */}
      <div className="bg-white border-b sticky top-0 z-30 px-4 md:px-8 pt-4 md:pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              Portfolio Insights 📊
            </h2>
            <p className="text-[10px] md:text-xs text-gray-400 font-medium">Real-time performance of your brand.</p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={exportToCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap"
            >
              <FaDownload size={12} /> CSV
            </button>
            <button 
              onClick={exportToPDF}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange-600 text-white px-3 md:px-5 py-2 rounded-xl text-xs md:text-sm font-bold shadow-md whitespace-nowrap"
            >
              <FaFilePdf size={12} /> PDF
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs - Mobile Scrollable */}
        <div className="flex w-100 md:w-full gap-4 md:gap-8 overflow-x-auto  border-b border-transparent">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === tab.name ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* AI Insight Banner - Responsive Text */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 md:p-5 rounded-2xl md:rounded-3xl text-white shadow-xl flex items-center gap-3 md:gap-5">
          <div className="bg-white/20 p-2 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-sm shrink-0">
             {insight.icon}
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] font-black opacity-90 uppercase tracking-[0.1em] md:tracking-[0.2em]">AI Analyst</p>
            <p className="text-xs md:text-base font-semibold leading-tight mt-1">{insight.text}</p>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="animate-in fade-in duration-500 overflow-hidden">
          {activeTab === 'Overview' ? (
            <div className="space-y-6 md:space-y-8">
              {/* Stats Grid - 1 col on mobile, 3 on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                  <FaUserFriends className="text-orange-500 mb-2" />
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-black">Active Users (7D)</p>
                  <h3 className="text-2xl md:text-4xl font-black text-gray-800 mt-2 font-mono">{totalActiveUsers.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                  <FaChartLine className="text-blue-500 mb-2" />
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-black">Total Sessions</p>
                  <h3 className="text-2xl md:text-4xl font-black text-gray-800 mt-2 font-mono">{totalSessions.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center sm:col-span-2 md:col-span-1">
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-black mb-2">Cloud Status</p>
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <h3 className="text-md md:text-lg font-black text-gray-700 tracking-widest uppercase">Connected</h3>
                  </div>
                </div>
              </div>

              {/* Chart Container - Fixed Height for Mobile */}
              <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <h4 className="text-sm md:text-lg text-gray-800 font-black italic mb-6 md:mb-8 uppercase flex items-center gap-2">
                  <FaChartLine className="text-orange-500" /> Trend Analysis
                </h4>
                <div className="h-[250px] md:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="users" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            /* Sub-tabs Container - Responsive Wrapper */
            <div className="w-full overflow-x-auto">
              {activeTab === 'Traffic Sources' && <TrafficTab data={data} />}
              {activeTab === 'Referrers' && <ReferrerTab data={data} />}
              {activeTab === 'User Behavior' && <BehaviorTab data={data} />}
              {activeTab === 'Geo Data' && <GeoDataTab data={data}/>}
              {activeTab === 'Event Tab' && <EventDataTab data={data}/>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}