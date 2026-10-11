/***************************************************
 * File: lib/utils/htmlImages.ts
 * Purpose:
 * - Rich-text content (blog bodies written in the dashboard editor) can
 *   contain <img> tags without alt text, which fails accessibility checks
 *   and gives screen-reader users nothing. This adds a fallback alt and
 *   lazy-loading hints to any image that lacks them, without touching
 *   images that already have them.
 * - Pure string transform; safe to call on the server before rendering.
 ***************************************************/

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function withImageDefaults(html: string, fallbackAlt: string): string {
  if (!html) return html;
  const alt = escapeAttribute(fallbackAlt.trim());

  // Attribute values may legitimately contain ">" (e.g. alt="A > B"), so the
  // attribute block is matched as a sequence of quoted strings or non-">" chars
  // rather than a naive [^>]* run.
  return html.replace(/<img\b((?:[^>"']|"[^"]*"|'[^']*')*?)\s*\/?>/gi, (_match, rawAttrs: string) => {
    let attrs = rawAttrs;
    if (!/\balt\s*=/i.test(attrs)) attrs += ` alt="${alt}"`;
    if (!/\bloading\s*=/i.test(attrs)) attrs += ' loading="lazy"';
    if (!/\bdecoding\s*=/i.test(attrs)) attrs += ' decoding="async"';
    return `<img${attrs}>`;
  });
}
