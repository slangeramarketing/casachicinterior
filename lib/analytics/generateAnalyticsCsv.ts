/**
 * Purpose:
 * - Generate CSV exports for Google Analytics dashboard
 *
 * Used By:
 * - Admin Analytics Dashboard
 *
 * Notes:
 * - Client-side only
 * - One CSV per data section
 */

type GASectionRow = {
  dimensionValues?: { value?: string }[];
  metricValues?: { value?: string }[];
};

export function generateAnalyticsCsv(params: {
  overview: GASectionRow[];
  traffic: GASectionRow[];
  behavior: GASectionRow[];
  geo: GASectionRow[];
  events: GASectionRow[];
  devices: GASectionRow[];
  referrers: GASectionRow[];
}) {
  const {
    overview,
    traffic,
    behavior,
    geo,
    events,
    devices,
    referrers,
  } = params;

  exportCsv(
    "analytics-overview.csv",
    ["Date", "Active Users", "Sessions"],
    overview.map(row => {
      const raw = row.dimensionValues?.[0]?.value;
      const date = raw
        ? `${raw.substring(6, 8)}/${raw.substring(4, 6)}/${raw.substring(0, 4)}`
        : "";
      return [
        date,
        row.metricValues?.[0]?.value ?? "0",
        row.metricValues?.[1]?.value ?? "0",
      ];
    })
  );

  exportCsv(
    "analytics-traffic.csv",
    ["Channel", "Active Users"],
    traffic.map(row => [
      row.dimensionValues?.[0]?.value ?? "Unknown",
      row.metricValues?.[0]?.value ?? "0",
    ])
  );

  exportCsv(
    "analytics-top-pages.csv",
    ["Page Path", "Views"],
    behavior.map(row => [
      row.dimensionValues?.[0]?.value ?? "",
      row.metricValues?.[0]?.value ?? "0",
    ])
  );

  exportCsv(
    "analytics-geo.csv",
    ["City", "Active Users"],
    geo.map(row => [
      row.dimensionValues?.[0]?.value ?? "Unknown",
      row.metricValues?.[0]?.value ?? "0",
    ])
  );

  exportCsv(
    "analytics-devices.csv",
    ["Device Category", "Active Users"],
    devices.map(row => [
      row.dimensionValues?.[0]?.value ?? "Unknown",
      row.metricValues?.[0]?.value ?? "0",
    ])
  );

  exportCsv(
    "analytics-referrers.csv",
    ["Referrer", "Active Users"],
    referrers.map(row => [
      row.dimensionValues?.[0]?.value ?? "Direct",
      row.metricValues?.[0]?.value ?? "0",
    ])
  );

  exportCsv(
    "analytics-events.csv",
    ["Event Name", "Page Path", "Count"],
    events.map(row => [
      row.dimensionValues?.[0]?.value ?? "",
      row.dimensionValues?.[1]?.value ?? "",
      row.metricValues?.[0]?.value ?? "0",
    ])
  );
}

/* ===================== HELPERS ===================== */

function exportCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
) {
  if (!rows.length) return;

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.map(escapeCsv).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escapes CSV values safely (comma, quotes, newline safe)
 */
function escapeCsv(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
