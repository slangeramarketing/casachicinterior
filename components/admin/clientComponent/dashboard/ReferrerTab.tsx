'use client';
import React from 'react';
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLink,
  FaGlobe,
  FaQuestionCircle,
} from 'react-icons/fa';

type SourceMeta = {
  icon: React.ReactNode;
  label: string;
  color: string;
};

export default function ReferrerTab({ data }: { data: any }) {
  const referrers = data?.referrers || [];

  // --- 🧠 Source Normalizer (GA4-aware) ---
  const getSourceDetails = (source: string, medium: string): SourceMeta => {
    const s = source.toLowerCase();
    const m = medium.toLowerCase();

    // ❓ Unknown / Not set
    if (s === '(not set)' || m === '(not set)') {
      return {
        icon: <FaQuestionCircle className="text-gray-500" />,
        label: 'Unknown / Unattributed',
        color: 'bg-gray-50',
      };
    }

    // 🔗 Direct
    if (s === 'direct' || m === '(none)') {
      return {
        icon: <FaLink className="text-orange-600" />,
        label: 'Direct / Bookmark',
        color: 'bg-orange-50',
      };
    }

    // 🌐 Social platforms
    if (s.includes('instagram')) {
      return {
        icon: <FaInstagram className="text-pink-600" />,
        label: 'Instagram',
        color: 'bg-pink-50',
      };
    }

    if (s.includes('facebook')) {
      return {
        icon: <FaFacebook className="text-blue-700" />,
        label: 'Facebook',
        color: 'bg-blue-50',
      };
    }

    if (s.includes('linkedin')) {
      return {
        icon: <FaLinkedin className="text-blue-600" />,
        label: 'LinkedIn',
        color: 'bg-blue-50',
      };
    }

    if (s.includes('twitter') || s.includes('x')) {
      return {
        icon: <FaTwitter className="text-sky-500" />,
        label: 'Twitter / X',
        color: 'bg-sky-50',
      };
    }

    // 🔍 Search
    if (s.includes('google')) {
      return {
        icon: <FaGlobe className="text-green-600" />,
        label: 'Google Search',
        color: 'bg-green-50',
      };
    }

    // 🌍 Fallback
    return {
      icon: <FaGlobe className="text-gray-600" />,
      label: `${source} / ${medium}`,
      color: 'bg-gray-50',
    };
  };

  return (
    <div className="bg-white md:p-6 rounded-2xl shadow-sm animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 px-4 py-4">
        <div className="w-full">
          <h4 className="font-bold text-gray-800 text-lg">
            Traffic Sources 🔗
          </h4>
          <p className="text-[10px] text-gray-400 font-medium">
            Where your visitors are coming from
          </p>
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
          GA4 · Last 7 Days
        </span>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 space-y-3 px-2 md:px-0">
        {referrers.length > 0 ? (
          referrers.map((row: any, i: number) => {
            const source = row.dimensionValues?.[0]?.value ?? '(not set)';
            const medium = row.dimensionValues?.[1]?.value ?? '(not set)';
            const users = row.metricValues?.[0]?.value ?? '0';

            const { icon, label, color } = getSourceDetails(source, medium);

            return (
              <div
                key={i}
                className={`p-4 ${color} rounded-2xl border border-transparent hover:border-gray-200 transition shadow-sm`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{icon}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {label}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {source} / {medium}
                      </p>
                    </div>
                  </div>

                  <div className="text-right bg-white/60 px-3 py-1 rounded-lg">
                    <span className="block text-lg font-black text-gray-800 leading-none">
                      {users}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                      Visitors
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 italic text-sm">
              No traffic source data yet. Start marketing 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
