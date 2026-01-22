'use client';
import React from 'react';
import { 
  FaSearch, FaLink, FaExternalLinkAlt, FaGlobe, 
  FaMobileAlt, FaEnvelope, FaBullhorn 
} from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';

export default function TrafficTab({ data }: { data: any }) {
  const trafficSources = data?.traffic || [];

  // Icon mapping for traffic acquisition channels
  const getTrafficIcon = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('organic search') || s.includes('google') || s.includes('bing')) 
      return { icon: <FaSearch className="text-blue-500" />, color: 'bg-blue-50' };
    
    if (s.includes('direct')) 
      return { icon: <FaMobileAlt className="text-purple-500" />, color: 'bg-purple-50' };
    
    if (s.includes('referral')) 
      return { icon: <FaExternalLinkAlt className="text-orange-500" />, color: 'bg-orange-50' };
    
    if (s.includes('organic social') || s.includes('social')) 
      return { icon: <FaBullhorn className="text-pink-500" />, color: 'bg-pink-50' };
    
    if (s.includes('email')) 
      return { icon: <FaEnvelope className="text-red-500" />, color: 'bg-red-50' };

    return { icon: <FaGlobe className="text-green-500" />, color: 'bg-green-50' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Traffic Acquisition <HiLightningBolt className="text-orange-500" />
          </h3>
          <p className="text-xs text-gray-400 mt-1">Where are your visitors coming from?</p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-green-700 uppercase">Live Data</span>
        </div>
      </div>

      <div className="space-y-3">
        {trafficSources.length > 0 ? (
          trafficSources.map((row: any, index: number) => {
            const sourceName = row.dimensionValues?.[0]?.value || 'Unknown';
            const userCount = parseInt(row.metricValues?.[0]?.value || '0');
            const { icon, color } = getTrafficIcon(sourceName);

            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:border-orange-200 hover:bg-white transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className={`${color} p-3 rounded-xl shadow-inner text-lg group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors block">
                      {sourceName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">Channel Grouping</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-lg font-black text-gray-800 block leading-none">
                    {userCount.toLocaleString()}
                  </span>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1">Visitors</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-300">
               <FaSearch size={20} />
            </div>
            <p className="text-sm text-gray-400 italic font-medium">No traffic data found for this period...</p>
          </div>
        )}
      </div>

      {/* Tip Section with Icon */}
      <div className="mt-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex gap-3 items-start">
        <div className="bg-orange-500 text-white p-1.5 rounded-lg text-xs mt-0.5 shadow-sm shadow-orange-200">
          <HiLightningBolt />
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
          <strong className="text-orange-700 uppercase tracking-tighter mr-1">Pro Tip:</strong> 
          'Organic Search' means Google/Bing results. 'Direct' means someone typed your URL. 
          Use 'Organic Social' data to see which platform's audience is most engaged.
        </p>
      </div>
    </div>
  );
}