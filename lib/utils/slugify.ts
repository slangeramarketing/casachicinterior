/***************************************************
 * File: lib/utils/slugify.ts
 * Purpose: One slug rule for forms and services ("Greater Noida West"
 * -> "greater-noida-west"). Lower-case ASCII letters, digits and single
 * hyphens only; nothing else survives.
 ***************************************************/

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
