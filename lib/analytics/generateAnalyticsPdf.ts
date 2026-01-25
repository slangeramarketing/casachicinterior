import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Purpose:
 * - Generate full Google Analytics PDF report
 *
 * Used By:
 * - Admin Analytics Dashboard
 *
 * Notes:
 * - Client-side only
 * - Auto handles pagination
 */
export function generateAnalyticsPdf(params: {
  overview: any[];
  traffic: any[];
  behavior: any[];
  geo: any[];
  events: any[];
  devices: any[];
  referrers: any[];
  totalActiveUsers: number;
  totalSessions: number;
}) {
  const {
    overview,
    traffic,
    behavior,
    geo,
    events,
    devices,
    referrers,
    totalActiveUsers,
    totalSessions,
  } = params;

  if (!overview.length) return;

  const doc = new jsPDF("p", "mm", "a4");
  let cursorY = 20;

  /* ---------- HEADER ---------- */
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text("Portfolio Analytics Report", 14, cursorY);

  cursorY += 8;
  doc.setFontSize(11);
  doc.setTextColor(120);
  doc.text("Google Analytics – Last 7 Days", 14, cursorY);

  cursorY += 10;

  /* ---------- SUMMARY ---------- */
  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text("Overview Summary", 14, cursorY);
  cursorY += 6;

  doc.roundedRect(14, cursorY, 85, 18, 3, 3);
  doc.roundedRect(111, cursorY, 85, 18, 3, 3);

  doc.setFontSize(11);
  doc.text("Total Active Users", 18, cursorY + 7);
  doc.setFontSize(16);
  doc.text(totalActiveUsers.toLocaleString(), 18, cursorY + 14);

  doc.setFontSize(11);
  doc.text("Total Sessions", 115, cursorY + 7);
  doc.setFontSize(16);
  doc.text(totalSessions.toLocaleString(), 115, cursorY + 14);

  cursorY += 28;

  /* ---------- DAILY TREND ---------- */
  autoTable(doc, {
    startY: cursorY,
    head: [["Date", "Active Users", "Sessions"]],
    body: overview.map((row: any) => {
      const raw = row.dimensionValues?.[0]?.value;
      const date = raw
        ? `${raw.substring(6, 8)}/${raw.substring(4, 6)}/${raw.substring(0, 4)}`
        : "";
      return [
        date,
        row.metricValues?.[0]?.value || "0",
        row.metricValues?.[1]?.value || "0",
      ];
    }),
    headStyles: { fillColor: [249, 115, 22] },
    styles: { fontSize: 9 },
    theme: "grid",
  });

  cursorY = (doc as any).lastAutoTable.finalY + 10;

  /* ---------- TRAFFIC ---------- */
  sectionTable(doc, "Traffic Sources", ["Channel", "Users"], traffic, cursorY, [
    59, 130, 246,
  ]);
  cursorY = nextY(doc);

  /* ---------- BEHAVIOR ---------- */
  sectionTable(
    doc,
    "Top Pages",
    ["Page", "Views"],
    behavior.slice(0, 10),
    cursorY,
    [16, 185, 129]
  );
  cursorY = nextY(doc);

  /* ---------- GEO ---------- */
  sectionTable(
    doc,
    "Top Cities",
    ["City", "Users"],
    geo.slice(0, 10),
    cursorY,
    [168, 85, 247]
  );
  cursorY = nextY(doc);

  /* ---------- DEVICES ---------- */
  sectionTable(
    doc,
    "Devices",
    ["Device", "Users"],
    devices,
    cursorY,
    [234, 179, 8]
  );
  cursorY = nextY(doc);

  /* ---------- REFERRERS ---------- */
  sectionTable(
    doc,
    "Referrers",
    ["Source", "Users"],
    referrers.slice(0, 10),
    cursorY,
    [239, 68, 68]
  );
  cursorY = nextY(doc);

  /* ---------- EVENTS ---------- */
  autoTable(doc, {
    startY: cursorY,
    head: [["Event", "Page", "Count"]],
    body: events.slice(0, 10).map((row: any) => [
      row.dimensionValues?.[0]?.value || "",
      row.dimensionValues?.[1]?.value || "",
      row.metricValues?.[0]?.value || "0",
    ]),
    headStyles: { fillColor: [20, 184, 166] },
    styles: { fontSize: 9 },
    theme: "grid",
  });

  /* ---------- FOOTER ---------- */
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    `Generated on ${new Date().toLocaleString()}`,
    14,
    pageHeight - 10
  );

  doc.save("analytics-full-report.pdf");
}

/* ================= HELPERS ================= */

function sectionTable(
  doc: jsPDF,
  title: string,
  headers: string[],
  rows: any[],
  startY: number,
  color: [number, number, number]
) {
  doc.text(title, 14, startY);

  autoTable(doc, {
    startY: startY + 4,
    head: [headers],
    body: rows.map((row: any) => [
      row.dimensionValues?.[0]?.value || "Unknown",
      row.metricValues?.[0]?.value || "0",
    ]),
    headStyles: { fillColor: color },
    styles: { fontSize: 9 },
    theme: "striped",
  });
}


function nextY(doc: jsPDF) {
  return (doc as any).lastAutoTable.finalY + 10;
}
