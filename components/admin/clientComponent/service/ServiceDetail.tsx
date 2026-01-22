import Image from "next/image";
import Link from "next/link";
import { FiEdit2, FiCheckCircle, FiInfo, FiLayers, FiSearch, FiTag, FiHash, FiPlayCircle, FiInstagram, FiExternalLink, FiYoutube } from "react-icons/fi";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { ServiceResponseDTO } from "@/modules/services/service.dto";
import { getInteriorIconById } from "@/public/assets/constants-icons/interior-icons";

interface AdminServiceDetailProps {
  service: ServiceResponseDTO;
}

export default function AdminServiceDetail({ service }: AdminServiceDetailProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ================= ADMIN TOP BAR ================= */}
      <div className="bg-white border-b top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <PageRouteHeader />
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              service.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {service.status}
            </span>
            <Link
              href={`/admin/service/${service.id}`}
              className="flex items-center gap-2 bg-bg-primary text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-orange-700 transition"
            >
              <FiEdit2 />Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. HERO PREVIEW */}
            <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div className="relative h-72 w-full">
                <Image src={service.coverImage} alt={service.title} fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  {service.featured && (
                    <span className="bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">⭐ FEATURED</span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
                <p className="text-gray-500 mt-2 italic">Slug: {service.slug}</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 leading-relaxed">{service.shortDescription}</p>
                </div>
              </div>
            </section>

            {/* 2. DESCRIPTION PREVIEW */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800">
                <FiLayers className="text-blue-500"/> Long Description
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600">
                {/* Render Rich Text Content */}
                {typeof service.description === 'string' 
                  ? service.description 
                  : "Rich text content structure detected."}
              </div>
            </section>

            {/* 3. GALLERY PREVIEW */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Media Gallery ({service.gallery.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {service.gallery.map((img, idx) => (
                  <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                    <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 opacity-0 group-hover:opacity-100 transition">
                        <p className="text-[10px] text-white truncate text-center">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 3.5 VIDEO SHOWCASE PREVIEW (NEW 🔥) */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
                <FiPlayCircle className="text-orange-500" /> Video Showcase
              </h2>

              <div className="space-y-8">
                {/* --- Instagram Reels --- */}
                <div>
                  <h3 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiInstagram /> Instagram Reels ({service.videoShowcase?.reels?.length || 0})
                  </h3>
                  {service.videoShowcase?.reels?.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {service.videoShowcase.reels.map((reel, idx) => (
                        <div key={idx} className="min-w-[200px] max-w-[200px] group bg-gray-50 rounded-xl border p-3">
                          <div className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-pink-50 rounded-lg mb-3 flex items-center justify-center border border-pink-100 overflow-hidden relative">
                            {reel.thumbnail ? (
                              <Image src={reel.thumbnail} alt={reel.title || ""} fill className="object-cover" />
                            ) : (
                              <FiInstagram size={32} className="text-pink-200" />
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center">
                              <a href={reel.url} target="_blank" className="bg-white p-2 rounded-full text-pink-600 shadow-lg scale-0 group-hover:scale-100 transition transform duration-200">
                                  <FiExternalLink size={16} />
                              </a>
                            </div>
                          </div>
                          <p className="text-[11px] font-bold text-gray-700 truncate">{reel.title || "Untitled Reel"}</p>
                          <p className="text-[9px] text-gray-400 truncate mt-1">{reel.url}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-xl border border-dashed">No Instagram reels added.</p>
                  )}
                </div>

                {/* --- YouTube Projects --- */}
                <div>
                  <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FiYoutube /> YouTube Projects ({service.videoShowcase?.youtube?.length || 0})
                  </h3>
                  {service.videoShowcase?.youtube?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.videoShowcase.youtube.map((video, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl border p-3">
                          <div className="aspect-video bg-black rounded-lg overflow-hidden border mb-3">
                            <iframe 
                              className="w-full h-full" 
                              src={`https://www.youtube.com/embed/${video.embedId}`} 
                              title={video.title}
                              allowFullScreen
                            />
                          </div>
                          <p className="text-xs font-bold text-gray-800">{video.title}</p>
                          {video.description && <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{video.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-xl border border-dashed">No YouTube videos added.</p>
                  )}
                </div>
              </div>
            </section>

            {/* 4. FAQS PREVIEW */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-4 text-gray-800 uppercase tracking-wider text-xs">SEO FAQ Goldmine</h2>
              <div className="space-y-4">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-sm text-gray-900 font-mono">Q: {faq.question}</p>
                    <p className="text-sm text-gray-600 mt-2 italic">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - Meta Data & Quick Info */}
          <div className="space-y-8">
            
            {/* QUICK STATS & INFORMATION */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-3">
                <FiInfo className="text-blue-500" /> Service Information
              </h3>

              <div className="space-y-5">
                {/* Category Info Block */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Category Details</span>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    {/* Category Icon */}
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-orange-600 border border-orange-100">
                      {(() => {
                        const CatIcon = getInteriorIconById(service.category.icon || "check");
                        return <CatIcon size={20} />;
                      })()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{service.category.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">slug: {service.category.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 pt-2">
                  {/* Starting Price */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-50/50 border border-green-100">
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="bg-green-100 p-1.5 rounded-md"><FiTag size={14} /></span>
                      <span className="text-xs font-semibold">Starting Price</span>
                    </div>
                    <span className="font-bold text-green-600">
                      ₹{service.startingPrice?.toLocaleString() || 0} <span className="text-[10px] text-green-500 font-normal">/ {service.priceUnit}</span>
                    </span>
                  </div>

                  {/* Display Order */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <FiLayers size={14} />
                      <span>Display Order</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-1 rounded text-gray-700">
                      #{service.displayOrder}
                    </span>
                  </div>

                  {/* Internal ID (Optional but helpful for Admins) */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <FiHash size={14} />
                      <span className="text-xs">Internal ID:</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 select-all cursor-copy hover:text-blue-500 transition-colors">
                      {service.id.slice(-8)}_(Full ID: {service.id})
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* HIGHLIGHTS SECTION IN ADMIN DETAIL */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-green-500"/> Highlights Preview
              </h3>
              <div className="grid gap-3">
                {service.highlights.map((h, i) => {
                  const IconNode = getInteriorIconById(h.icon); // Function call to get React Icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                      <div className="flex-none w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-orange-600 border border-orange-100">
                        <IconNode size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800">{h.title}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tight">Icon ID: {h.icon}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SEO PREVIEW CARD */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 ring-1 ring-blue-50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <FiSearch /> Google Preview
              </h3>
              <div className="space-y-2">
                <p className="text-blue-700 text-lg hover:underline cursor-pointer truncate">{service.seo.title}</p>
                <p className="text-green-700 text-xs truncate">yourdomain.com › service › {service.slug}</p>
                <p className="text-gray-600 text-xs line-clamp-2">{service.seo.description}</p>
                <div className="pt-4 flex flex-wrap gap-1">
                  {service.seo.keywords.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-500 italic">#{tag}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-gray-900 p-6 rounded-2xl text-white">
              <h3 className="text-xs uppercase text-gray-400 font-bold mb-4 tracking-widest">Call to Action</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Button Text</p>
                  <p className="font-semibold">{service.ctaText}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Link</p>
                  <p className="text-blue-400 text-sm break-all underline">{service.ctaLink}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}