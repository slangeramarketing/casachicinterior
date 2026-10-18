/***************************************************
 * File: lib/utils/formatIst.ts
 * Purpose: Deterministic "17 Oct 2026, 10:42 IST" formatting that is
 * identical on the server and in every browser. toLocaleString() depends
 * on the machine's locale and timezone and caused hydration mismatches
 * in admin lists.
 ***************************************************/

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const IST_OFFSET_MS = 330 * 60 * 1000;

export function formatIst(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const d = new Date(t + IST_OFFSET_MS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} IST`;
}
