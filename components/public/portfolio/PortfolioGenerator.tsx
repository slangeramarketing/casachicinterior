"use client";

/***************************************************
 * File: components/public/services/PortfolioGenerator.tsx
 * Layer: UI – Client Component
 *
 * Updates:
 * - Fixed Cover Page Geometric Patterns (Ref 2 Style).
 * - Fixed Project Specs Badges: Letter-spacing reduced, font size normalized,
 * costEstimate and timeline aligned (Ref 1 Style).
 * - Added distinct 'Material Guarantee' page (Ref 2 Style).
 ***************************************************/

import { useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { PortfolioItemDTO } from "@/modules/portfolio/portfolio.dto";
import { FiDownload } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

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

function drawGeometricCover(doc: jsPDF, W: number, H: number, ORANGE: string, NAVY: string, TEAL: string) {
  // Left Accent bar
  doc.setFillColor(ORANGE);
  doc.rect(0, 0, 10, H, "F");

  // Diagonal Triangle (Top Right - Ref 2 Style)
  doc.setFillColor(NAVY);
  doc.triangle(W * 0.45, 0, W, 0, W, H * 0.5, "F");

  // Concentric Circles (Bottom Left - Ref 2 Style)
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  for (let i = 1; i <= 6; i++) {
    doc.circle(0, H, i * 14, "S");
  }
}

// ─────────────────────────────────────────────────────────
//  PDF Builder Logic
// ─────────────────────────────────────────────────────────
async function generateBrochurePDF(projects: PortfolioItemDTO[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const ORANGE = "#F97316";
  const NAVY = "#090F1A";
  const DARK_TEAL = "#082332";

  // ── PAGE 1: LUXURY COVER (Ref 2 Inspired Layout) ─────
  doc.setFillColor(DARK_TEAL);
  doc.rect(0, 0, W, H, "F");

  // Draw enhanced geometric patterns
  drawGeometricCover(doc, W, H, ORANGE, NAVY, DARK_TEAL);

  // Logo / Brand Name
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  doc.text("CasaChic", 25, 60);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(ORANGE);
  doc.text("TRANSFORMATION BEYOND IMAGINATION", 25, 72);

  // Headline
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text("Business", 25, 110);
  doc.text("Portfolio 2026", 25, 125);

  // Sub-headline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("#cccccc");
  doc.text("Premium Interior Solutions | Delhi NCR | Fixed Pricing", 25, 138);

  // Trust Badges Row (Ref 1 Style for consistent numbers)
  const badges = [
    { val: "250+", label: "Projects Transformed" },
    { val: "45 Days", label: "Timeline Guarantee" },
    { val: "Fixed", label: "Price Policy" }
  ];
  badges.forEach((b, i) => {
    const bx = 25 + i * 58;
    drawRoundedRect(doc, bx, 155, 52, 28, 5, "#0d2e40");
    doc.setTextColor(ORANGE);
    doc.setFontSize(18); // Value font size
    doc.setFont("helvetica", "bold");
    doc.text(b.val, bx + 26, 168, { align: "center" });
    doc.setTextColor("#FFFFFF");
    doc.setFontSize(8); // Label font size
    doc.setFont("helvetica", "normal");
    doc.text(b.label, bx + 26, 176, { align: "center" });
  });

  // Floating WhatsApp CTA (Ref 2 Style)
  drawRoundedRect(doc, 25, H - 65, 110, 25, 8, NAVY);
  doc.setTextColor(ORANGE);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ready to Renovate Your Home?", 35, H - 52);
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("WhatsApp for Free Estimate: wa.me/919999999999", 35, H - 45);

  // ── PAGES 2+: PROJECT SHOWCASE ──────────────────────────
  for (const project of projects) {
    doc.addPage();
    doc.setFillColor("#FFFFFF");
    doc.rect(0, 0, W, H, "F");

    // Corporate Header
    doc.setFillColor(NAVY);
    doc.rect(0, 0, W, 25, "F");
    doc.setFillColor(ORANGE);
    doc.rect(0, 0, 8, 25, "F");
    doc.setTextColor("#FFFFFF");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(project.title, 15, 14);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Location: ${project.location}`, 15, 20);

    // Images Comparison (Before/After)
    const [bBefore, bAfter] = await Promise.all([
      loadImageAsBase64(project.beforeImg),
      loadImageAsBase64(project.afterImg)
    ]);

    const imgY = 35;
    const imgW = 88;
    const imgH = 65;

    // Before
    if (bBefore) {
      doc.addImage(bBefore, "JPEG", 12, imgY, imgW, imgH);
      doc.setFillColor("#000000"); // Standard Black label
      doc.rect(12, imgY + imgH - 8, imgW, 8, "F");
      doc.setTextColor("#FFFFFF");
      doc.setFontSize(7);
      doc.text("BEFORE: RAW SITE", 12 + imgW / 2, imgY + imgH - 3, { align: "center" });
    }

    // After
    if (bAfter) {
      doc.addImage(bAfter, "JPEG", 110, imgY, imgW, imgH);
      doc.setFillColor(ORANGE); // Premium Orange label
      doc.rect(110, imgY + imgH - 8, imgW, 8, "F");
      doc.setTextColor("#FFFFFF");
      doc.setFontSize(7);
      doc.text("AFTER: CASA CHIC TRANSFORMATION", 110 + imgW / 2, imgY + imgH - 3, { align: "center" });
    }

    // Project Specs Badges (Fixed Ref 1 Typography & Content)
    const specY = 110;

    // Project Estimate (Cost Range)
    drawRoundedRect(doc, 12, specY, 70, 25, 4, "#FFF7ED"); // Pale Orange
    doc.setTextColor(ORANGE);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT ESTIMATE", 19, specY + 10);
    doc.setTextColor(NAVY);
    doc.setFontSize(11); // Value font size (Ref 1 style)
    doc.setFont("helvetica", "normal");
    doc.text(project.costRange, 19, specY + 18);

    // Delivery Timeline
    drawRoundedRect(doc, 86, specY, 60, 25, 4, "#EFF6FF"); // Pale Blue
    doc.setTextColor("#1d4ed8");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("DELIVERY TIMELINE", 93, specY + 10);
    doc.setTextColor(NAVY);
    doc.setFontSize(11); // Value font size (Ref 1 style)
    doc.setFont("helvetica", "normal");
    doc.text(project.timelineLabel, 93, specY + 18);

    // Key Highlights (Ref 1 Style)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NAVY);
    doc.text("Transformation Highlights", 12, 160);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    project.highlights.slice(0, 4).forEach((h, i) => {
      doc.setTextColor(ORANGE);
      doc.text("✓", 15, 172 + i * 10);
      doc.setTextColor("#4A5568");
      doc.text(h, 22, 172 + i * 10);
    });

    // Materials Used Badges
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NAVY);
    doc.text("Premium Materials Used", 12, 220);

    let bx = 12;
    project.materialSpecList.slice(0, 5).forEach((m) => {
      drawRoundedRect(doc, bx, 228, 35, 10, 2, "#F3F4F6");
      doc.setTextColor(NAVY);
      doc.setFontSize(8);
      doc.text(m.brand, bx + 17.5, 234.5, { align: "center" });
      bx += 38;
    });

    // Footer
    doc.setFontSize(7);
    doc.setTextColor("#CBD5E0");
    doc.text("CasaChic Interior Portfolio © 2026", W / 2, H - 10, { align: "center" });
  }

  // ── NEW PAGE: MEET OUR LEADERSHIP (Requested Page) ─────
  doc.addPage();
  doc.setFillColor(NAVY);
  doc.rect(0, 0, W, H, "F");

  // Subtle Geometric Watermark Patterns
  doc.setDrawColor("#1A202C");
  doc.setLineWidth(0.1);
  for (let i = 0; i < 10; i++) {
    doc.line(0, i * 30, W, i * 30 + 50);
    doc.line(W, i * 30, 0, i * 30 + 50);
  }

  // Header
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("The Visionaries Behind CasaChic", 20, 30);
  doc.setFillColor(ORANGE);
  doc.rect(20, 33, 60, 1.5, "F"); // Orange underline

  // Team Data
  const founders = [
    { name: "Nishant Poonia", role: "CEO & Founder" },
    { name: "Ashutosh Goyal", role: "COO & Co-founder" }
  ];
  const middleRow = [
    { name: "Farooq Saifi", role: "Production Head" },
    { name: "Shivam Jaiswal", role: "VP & Sales Director" },
    { name: "Kanhaiya Nayak", role: "CMO" }
  ];
  const bottomRow = [
    { name: "Hanu Arya", role: "Marketing Manager" },
    { name: "Abhinay Yadav", role: "CTO" },
    { name: "Rohit Kumar", role: "Senior Executive" }
  ];

  const drawMemberCard = (x: number, y: number, w: number, name: string, role: string, isLarge = false) => {
    const radius = isLarge ? 18 : 14;

    // Circular Image Frame (Placeholder Circle)
    doc.setDrawColor(ORANGE);
    doc.setLineWidth(0.8);
    doc.circle(x + w / 2, y + radius, radius, "S");

    // Initials Placeholder inside circle
    doc.setFontSize(isLarge ? 14 : 10);
    doc.setTextColor("#2D3748");
    doc.text(name.split(" ").map(n => n[0]).join(""), x + w / 2, y + radius + (isLarge ? 5 : 4), { align: "center" });

    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(isLarge ? 13 : 10);
    doc.setTextColor("#FFFFFF");
    doc.text(name, x + w / 2, y + (isLarge ? 48 : 38), { align: "center" });

    // Designation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(isLarge ? 9 : 7.5);
    doc.setTextColor(ORANGE);
    doc.text(role, x + w / 2, y + (isLarge ? 55 : 44), { align: "center" });

    // LinkedIn Icon-style dot
    doc.setFillColor("#0077B5");
    doc.circle(x + w / 2 - (isLarge ? 18 : 14), y + (isLarge ? 48 : 38) - 1.5, 1.5, "F");
  };

  // Row 1: Founders
  founders.forEach((m, i) => {
    const gap = 15;
    const cardW = 70;
    const startX = (W - (founders.length * cardW + (founders.length - 1) * gap)) / 2;
    drawMemberCard(startX + i * (cardW + gap), 55, cardW, m.name, m.role, true);
  });

  // Row 2: Leadership
  middleRow.forEach((m, i) => {
    const gap = 12;
    const cardW = 55;
    const startX = (W - (middleRow.length * cardW + (middleRow.length - 1) * gap)) / 2;
    drawMemberCard(startX + i * (cardW + gap), 135, cardW, m.name, m.role);
  });

  // Row 3: Operations & Tech
  bottomRow.forEach((m, i) => {
    const gap = 12;
    const cardW = 55;
    const startX = (W - (bottomRow.length * cardW + (bottomRow.length - 1) * gap)) / 2;
    drawMemberCard(startX + i * (cardW + gap), 205, cardW, m.name, m.role);
  });

  // Mission Statement Footer
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor("#CBD5E0");
  const missionStat = "A dedicated force of 8+ experts transforming spaces across Delhi NCR with precision and passion.";
  doc.text(missionStat, W / 2, H - 35, { align: "center" });

  // ── FINAL PAGE: MATERIAL GUARANTEE (Ref 2 Inspired) ────
  doc.addPage();
  doc.setFillColor(NAVY);
  doc.rect(0, 0, W, H, "F");

  // Grid Pattern Top Left (Ref 2 Style)
  doc.setFillColor("#1A202C");
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      doc.rect(15 + i * 8, 15 + j * 8, 4, 4, "F");
    }
  }

  // Large Bold Text
  doc.setTextColor(ORANGE);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("The Material", 25, 75);
  doc.text("Guarantee", 25, 88);

  // Philosophy Text
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const guaranteeText = doc.splitTextToSize("We strictly follow a Zero-Particle-Board policy. Every project is crafted using BWP Marine Grade Plywood or HDHMR from India's most trusted brands.", 110);
  doc.text(guaranteeText, 25, 102);

  // Big Brand List Grid
  let brandY = 140;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(ORANGE);
  doc.text("Our Quality Ecosystem", 25, 130);

  // Group brands from projects
  const uniqueBrands = new Map();
  projects.forEach(p => p.materialSpecList.forEach(m => uniqueBrands.set(m.brand, m.category)));

  const bList = Array.from(uniqueBrands.entries());
  bList.forEach(([brand, cat], i) => {
    const col = i % 2;
    const curX = col === 0 ? 25 : W / 2 + 5;
    if (col === 0 && i > 0) brandY += 20;

    drawRoundedRect(doc, curX, brandY, W / 2 - 30, 15, 3, "#1A202C");
    doc.setTextColor(ORANGE);
    doc.setFontSize(10);
    doc.text(brand, curX + 5, brandY + 6);
    doc.setTextColor("#718096");
    doc.setFontSize(7);
    doc.text(cat.toUpperCase(), curX + 5, brandY + 11);
  });

  // Final Call to Action
  drawRoundedRect(doc, 25, H - 55, W - 50, 35, 10, ORANGE);
  doc.setTextColor(NAVY);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Ready to transform your home?", W / 2, H - 38, { align: "center" });
  doc.setFontSize(10);
  doc.text("WhatsApp us: wa.me/919999999999 | casachicinterior.com", W / 2, H - 28, { align: "center" });

  doc.save(`CasaChic_Interior_Portfolio_2026.pdf`);
}

// ─────────────────────────────────────────────────────────
//  Component View
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
      className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#090F1A] text-white px-8 py-5 rounded-[2rem] font-bold text-lg shadow-2xl hover:bg-[#082332] transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Generating Premium Brochure…</span>
        </>
      ) : (
        <span className="flex items-center gap-3">
          <FaWhatsapp className="w-6 h-6 text-[#25D366] group-hover:scale-110 transition-transform" />
          <FiDownload className="w-6 h-6 text-[#F97316]" />
          <span className="tracking-tight">DOWNLOAD BUSINESS PORTFOLIO</span>
        </span>
      )}
    </motion.button>
  );
}