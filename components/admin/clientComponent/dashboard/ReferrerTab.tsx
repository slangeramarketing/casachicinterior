'use client';
import React from 'react';
import { 
  FaLinkedin, FaGithub, FaInstagram, FaFacebook, 
  FaTwitter, FaLink, FaGlobe, FaExternalLinkAlt, FaLaptopCode 
} from 'react-icons/fa';

export default function ReferrerTab({ data }: { data: any }) {
  const referrers = data?.referrers || [];

  // --- 🛠️ Smart Source Cleaner ---
  const getSourceDetails = (source: string) => {
    const s = source.toLowerCase();
    
    // 1. Localhost / Dev Check (Jo aapko abhi dikh raha hai)
    if (s.includes('localhost') || s.includes('127.0.0.1')) {
      return { icon: <FaLaptopCode className="text-purple-600" />, label: 'Internal / Dev Test', color: 'bg-purple-50' };
    }
    
    // 2. Social Media Branded Logic
    if (s.includes('linkedin') || s.includes('lnkd.in')) return { icon: <FaLinkedin className="text-blue-600" />, label: 'LinkedIn', color: 'bg-blue-50' };
    if (s.includes('github')) return { icon: <FaGithub className="text-gray-800" />, label: 'GitHub', color: 'bg-gray-100' };
    if (s.includes('instagram')) return { icon: <FaInstagram className="text-pink-600" />, label: 'Instagram', color: 'bg-pink-50' };
    if (s.includes('facebook') || s.includes('fb.com')) return { icon: <FaFacebook className="text-blue-700" />, label: 'Facebook', color: 'bg-blue-50' };
    if (s.includes('t.co') || s.includes('twitter') || s.includes('x.com')) return { icon: <FaTwitter className="text-sky-500" />, label: 'Twitter / X', color: 'bg-sky-50' };
    
    // 3. Direct Traffic
    if (s.includes('direct') || s === '(none)' || s === '(direct)') {
      return { icon: <FaLink className="text-orange-600" />, label: 'Direct / Bookmark', color: 'bg-orange-50' };
    }
    
    // 4. Other Websites
    return { icon: <FaGlobe className="text-green-600" />, label: source, color: 'bg-green-50' };
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            Traffic Sources (Referrers) 🔗
          </h4>
          <p className="text-[10px] text-gray-400 font-medium">Where your visitors are coming from</p>
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
          Live GA4 Data
        </span>
      </div>

      <div className="space-y-3">
        {referrers.length > 0 ? (
          referrers.map((row: any, i: number) => {
            const rawSource = row.dimensionValues[0].value || 'Direct';
            const users = row.metricValues[0].value;
            const { icon, label, color } = getSourceDetails(rawSource);
            
            // Check if it's a real link or internal
            const isDirect = rawSource.toLowerCase().includes('direct') || rawSource.includes('(');
            const isLocal = rawSource.toLowerCase().includes('localhost');
            const href = (isDirect || isLocal) ? '#' : (rawSource.startsWith('http') ? rawSource : `https://${rawSource}`);

            return (
              <div key={i} className={`flex justify-between items-center p-4 ${color} rounded-2xl border border-transparent hover:border-gray-200 transition-all group shadow-sm`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl shadow-xs text-xl group-hover:rotate-6 transition-transform">
                    {icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 tracking-tight">
                      {label}
                    </span>
                    {!isDirect && (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-blue-600 truncate max-w-[200px]"
                      >
                        {rawSource.replace('http://', '').replace('https://', '')} <FaExternalLinkAlt size={7} />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="text-right bg-white/50 px-3 py-1 rounded-lg">
                  <span className="block text-lg font-black text-gray-800 leading-none">
                    {users}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                    Visitors
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 italic text-sm">No referral data yet. Start sharing your link! 🚀</p>
          </div>
        )}
      </div>
    </div>
  );
}