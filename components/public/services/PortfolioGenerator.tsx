"use client";

/***************************************************
 * File: components/public/services/PortfolioGenerator.tsx
 * Layer: UI – Client Component
 *
 * Purpose:
 * - Generates a professional business brochure PDF using jsPDF.
 * - Produces a real brochure layout: Cover Page, Project Snapshots,
 *   Material Guarantee page — NOT a plain webpage print.
 *
 * Architecture Note:
 * - Receives PortfolioItemDTO[] from a Parent Server Component.
 * - Does NOT call any server-side code directly.
 ***************************************************/

import { useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { PortfolioItemDTO } from "@/modules/services/portfolio/portfolio.dto";
import { FiDownload } from "react-icons/fi";

interface PortfolioGeneratorProps {
  projects: PortfolioItemDTO[];
}

// ─────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────
async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawRoundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillColor: string
) {
  doc.setFillColor(fillColor);
  doc.roundedRect(x, y, w, h, r, r, "F");
}

// ─────────────────────────────────────────────────────────
//  PDF Builder
// ─────────────────────────────────────────────────────────
async function generateBrochurePDF(projects: PortfolioItemDTO[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const ORANGE = "#F97316";
  const NAVY = "#090F1A";
  const TEAL = "#082332";

  // ── PAGE 1: COVER ─────────────────────────────────────
  // Background
  doc.setFillColor(TEAL);
  doc.rect(0, 0, W, H, "F");

  // Accent bar
  doc.setFillColor(ORANGE);
  doc.rect(0, 0, 8, H, "F");

  // Diagonal decoration
  doc.setFillColor(NAVY);
  doc.triangle(W * 0.4, 0, W, 0, W, H * 0.55, "F");

  // Logo / Brand Name
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.text("CasaChic", 24, 55);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#F97316");
  doc.text("INTERIOR DESIGN", 24, 65);

  // Headline
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("Home Renovation", 24, 105);
  doc.text("Portfolio", 24, 117);

  // Sub-headline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#cccccc");
  doc.text("Premium Interior Transformations — Delhi NCR", 24, 130);

  // Stats row
  const stats = [
    { val: "250+", label: "Projects Done" },
    { val: "8 Yrs", label: "Experience" },
    { val: "100%", label: "Fixed Price" },
  ];
  stats.forEach((s, i) => {
    const x = 24 + i * 58;
    drawRoundedRect(doc, x, 150, 50, 28, 4, "#0d2e40");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(ORANGE);
    doc.text(s.val, x + 25, 163, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#aaaaaa");
    doc.text(s.label, x + 25, 171, { align: "center" });
  });

  // WhatsApp CTA
  drawRoundedRect(doc, 24, 200, 100, 18, 5, ORANGE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor("#FFFFFF");
  doc.text("WhatsApp for Free Quote", 74, 211, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("wa.me/919999999999", 74, 219, { align: "center" });

  // Page number
  doc.setFontSize(8);
  doc.setTextColor("#555555");
  doc.text("casachicinterior.com", W - 15, H - 8, { align: "right" });

  // ── PAGES 2+: PROJECT SNAPSHOTS ───────────────────────
  const chunks: PortfolioItemDTO[][] = [];
  for (let i = 0; i < projects.length; i += 2) {
    chunks.push(projects.slice(i, i + 2));
  }

  for (const chunk of chunks) {
    doc.addPage();

    // Page background
    doc.setFillColor("#fafafa");
    doc.rect(0, 0, W, H, "F");

    // Header strip
    doc.setFillColor(NAVY);
    doc.rect(0, 0, W, 20, "F");
    doc.setFillColor(ORANGE);
    doc.rect(0, 0, 5, 20, "F");
    doc.setTextColor("#FFFFFF");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("CasaChic Interior | Project Showcase", 12, 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("casachicinterior.com", W - 12, 13, { align: "right" });

    let yOffset = 30;

    for (const project of chunk) {
      // Project card bg
      drawRoundedRect(doc, 10, yOffset, W - 20, 115, 6, "#FFFFFF");

      // Project title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(NAVY);
      const title = doc.splitTextToSize(project.title, 120);
      doc.text(title, 18, yOffset + 10);

      // Location
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor("#888888");
      doc.text(`📍 ${project.location}`, 18, yOffset + 22);

      // Images (Before & After)
      const imgY = yOffset + 28;
      const imgH = 60;
      const imgW = 80;

      const [beforeB64, afterB64] = await Promise.all([
        loadImageAsBase64(project.beforeImg),
        loadImageAsBase64(project.afterImg),
      ]);

      if (beforeB64) {
        doc.addImage(beforeB64, "JPEG", 18, imgY, imgW, imgH);
        // Label
        doc.setFillColor("#333333");
        doc.rect(18, imgY + imgH - 8, imgW, 8, "F");
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text("BEFORE", 18 + imgW / 2, imgY + imgH - 2.5, { align: "center" });
      } else {
        drawRoundedRect(doc, 18, imgY, imgW, imgH, 4, "#E5E7EB");
        doc.setTextColor("#9CA3AF");
        doc.setFontSize(8);
        doc.text("Before Image", 18 + imgW / 2, imgY + imgH / 2, { align: "center" });
      }

      if (afterB64) {
        doc.addImage(afterB64, "JPEG", 105, imgY, imgW, imgH);
        doc.setFillColor(ORANGE);
        doc.rect(105, imgY + imgH - 8, imgW, 8, "F");
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text("AFTER", 105 + imgW / 2, imgY + imgH - 2.5, { align: "center" });
      } else {
        drawRoundedRect(doc, 105, imgY, imgW, imgH, 4, "#E5E7EB");
        doc.setTextColor("#9CA3AF");
        doc.setFontSize(8);
        doc.text("After Image", 105 + imgW / 2, imgY + imgH / 2, { align: "center" });
      }

      // Cost & Timeline badges
      const badgeY = yOffset + 96;

      drawRoundedRect(doc, 18, badgeY, 70, 14, 3, "#FFF7ED");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(ORANGE);
      doc.text("Cost Estimate", 19, badgeY + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(NAVY);
      doc.text(project.costRange, 19, badgeY + 11);

      drawRoundedRect(doc, 96, badgeY, 50, 14, 3, "#EFF6FF");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor("#1d4ed8");
      doc.text("Timeline", 98, badgeY + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(NAVY);
      doc.text(project.timelineLabel, 98, badgeY + 11);

      yOffset += 125;
    }
  }

  // ── LAST PAGE: MATERIAL GUARANTEE ─────────────────────
  doc.addPage();
  doc.setFillColor(NAVY);
  doc.rect(0, 0, W, H, "F");
  doc.setFillColor(ORANGE);
  doc.rect(0, 0, W, 40, "F");

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(NAVY);
  doc.text("Our Material Guarantee", W / 2, 22, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("We use only certified premium brands — verified, warrantied, and trusted.", W / 2, 33, { align: "center" });

  // Collect all unique brands
  const allBrands = new Map<string, { brand: string; category: string; productLine?: string }>();
  projects.forEach((p) =>
    p.materialSpecList.forEach((m) => {
      if (!allBrands.has(m.brand)) allBrands.set(m.brand, m);
    })
  );

  const brandList = Array.from(allBrands.values());
  let bY = 55;
  brandList.forEach((m, i) => {
    const col = i % 2;
    const bX = col === 0 ? 14 : W / 2 + 7;
    if (col === 0 && i > 0) bY += 22;

    drawRoundedRect(doc, bX, bY, W / 2 - 21, 18, 4, "#0d2e40");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(ORANGE);
    doc.text(m.brand, bX + 6, bY + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor("#cccccc");
    doc.text(`${m.category}${m.productLine ? ` — ${m.productLine}` : ""}`, bX + 6, bY + 15);
  });

  if (brandList.length % 2 === 0) bY += 22;
  else bY += 30;

  // Footer
  drawRoundedRect(doc, 14, H - 45, W - 28, 30, 6, ORANGE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(NAVY);
  doc.text("Ready to transform your home?", W / 2, H - 33, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("WhatsApp us: wa.me/919999999999  |  casachicinterior.com", W / 2, H - 23, { align: "center" });

  doc.save("CasaChic-Interior-Portfolio.pdf");
}

// ─────────────────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────────────────
export default function PortfolioGenerator({ projects }: PortfolioGeneratorProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generateBrochurePDF(projects);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={loading}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-3 bg-[#090F1A] text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-xl hover:bg-[#082332] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Generating Brochure…
        </>
      ) : (
        <span className="text-xs flex gap-2 md:text-2xl">
          <FiDownload className="w-5 h-5 text-[#F97316]" />
          Download Business Portfolio
        </span>
      )}
    </motion.button>
  );
}
