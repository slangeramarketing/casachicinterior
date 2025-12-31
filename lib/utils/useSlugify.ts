"use client";

/**
 * Reusable slug generator hook
 * Works for any model (service, blog, category, etc.)
 */
export function useSlugify() {
  function slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  return { slugify };
}
