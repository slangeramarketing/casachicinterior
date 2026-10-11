/***************************************************
 * File: modules/seo/__tests__/seo.service.test.ts
 * Layer: Service Test
 *
 * Purpose:
 * - Business rules of seo.service.ts (validation, normalisation,
 *   duplicate-route handling, published-only public reads)
 *
 * Restrictions:
 * - No real DB: repository and db connection are mocked
 ***************************************************/

import { describe, it, expect, vi, beforeEach } from "vitest";
import { Types } from "mongoose";
import * as seoService from "../seo.service";
import { seoRepository } from "../seo.repository";
import { PageSeoRecord } from "../seo.types";
import { AppError } from "@/lib/errors";

vi.mock("@/lib/db", () => ({ default: vi.fn() }));

vi.mock("../seo.repository", () => ({
  seoRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    findByRoute: vi.fn(),
    findAll: vi.fn(),
    updateById: vi.fn(),
    deleteById: vi.fn(),
  },
}));

const existingId = new Types.ObjectId();

const existing: PageSeoRecord = {
  _id: existingId,
  route: "/about",
  title: "About us",
  description: "Who we are",
  primaryKeyword: "interior designer noida",
  secondaryKeywords: ["home interiors"],
  heading: "",
  canonicalUrl: "",
  ogImage: "",
  metaRobots: "index, follow",
  status: "published",
  updatedBy: "u1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function expectAppError(promise: Promise<unknown>, code: string, statusCode?: number) {
  try {
    await promise;
    throw new Error(`Expected AppError ${code} but nothing was thrown`);
  } catch (err) {
    expect(err).toBeInstanceOf(AppError);
    expect((err as AppError).code).toBe(code);
    if (statusCode) expect((err as AppError).statusCode).toBe(statusCode);
  }
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("normalisation helpers", () => {
  it("normalises routes to a leading slash, lower case, no trailing slash", () => {
    expect(seoService.normalizeRoute("About/")).toBe("/about");
    expect(seoService.normalizeRoute("/")).toBe("/");
    expect(seoService.normalizeRoute("  /Services  ")).toBe("/services");
    expect(seoService.normalizeRoute("")).toBe("");
  });

  it("trims, drops empties and dedupes keywords case-insensitively", () => {
    expect(
      seoService.normalizeKeywords([" Modular Kitchen ", "modular kitchen", "", "Wardrobes"])
    ).toEqual(["Modular Kitchen", "Wardrobes"]);
  });

  it("removes the primary keyword from the secondary list", () => {
    expect(seoService.normalizeKeywords(["Sofa", "kitchen"], "KITCHEN")).toEqual(["Sofa"]);
  });
});

describe("createPageSeo", () => {
  it("creates a draft with defaults for optional fields", async () => {
    vi.mocked(seoRepository.findByRoute).mockResolvedValue(null);
    vi.mocked(seoRepository.create).mockImplementation(async (data) => ({
      ...(data as PageSeoRecord),
      _id: new Types.ObjectId(),
    }));

    const result = await seoService.createPageSeo(
      { route: "/contact", title: "Contact", description: "Reach us" },
      "admin-1"
    );

    expect(seoRepository.create).toHaveBeenCalledTimes(1);
    const saved = vi.mocked(seoRepository.create).mock.calls[0][0];
    expect(saved).toMatchObject({
      route: "/contact",
      status: "draft",
      metaRobots: "index, follow",
      secondaryKeywords: [],
      updatedBy: "admin-1",
    });
    expect(result.route).toBe("/contact");
  });

  it("rejects routes that are not in the managed page registry", async () => {
    await expectAppError(
      seoService.createPageSeo({ route: "/blogs/some-post", title: "x", description: "y" }, "u"),
      "SEO_ROUTE_NOT_MANAGED",
      400
    );
    expect(seoRepository.create).not.toHaveBeenCalled();
  });

  it("rejects a second entry for the same route with 409", async () => {
    vi.mocked(seoRepository.findByRoute).mockResolvedValue(existing);

    await expectAppError(
      seoService.createPageSeo({ route: "/about", title: "x", description: "y" }, "u"),
      "SEO_ROUTE_DUPLICATE",
      409
    );
    expect(seoRepository.create).not.toHaveBeenCalled();
  });

  it("requires title and description before publishing", async () => {
    vi.mocked(seoRepository.findByRoute).mockResolvedValue(null);

    await expectAppError(
      seoService.createPageSeo({ route: "/about", title: "", description: "", status: "published" }, "u"),
      "SEO_TITLE_REQUIRED"
    );
    await expectAppError(
      seoService.createPageSeo({ route: "/about", title: "Ok", description: "", status: "published" }, "u"),
      "SEO_DESCRIPTION_REQUIRED"
    );
  });

  it("enforces length limits, URL shapes and enums", async () => {
    vi.mocked(seoRepository.findByRoute).mockResolvedValue(null);
    const base = { route: "/about", title: "t", description: "d" };

    await expectAppError(
      seoService.createPageSeo({ ...base, title: "x".repeat(71) }, "u"),
      "SEO_TITLE_TOO_LONG"
    );
    await expectAppError(
      seoService.createPageSeo({ ...base, description: "x".repeat(171) }, "u"),
      "SEO_DESCRIPTION_TOO_LONG"
    );
    await expectAppError(
      seoService.createPageSeo({ ...base, canonicalUrl: "not-a-url" }, "u"),
      "SEO_CANONICAL_INVALID"
    );
    await expectAppError(
      seoService.createPageSeo({ ...base, ogImage: "uploads/x.png" }, "u"),
      "SEO_OG_IMAGE_INVALID"
    );
    await expectAppError(
      seoService.createPageSeo({ ...base, metaRobots: "noarchive" as never }, "u"),
      "SEO_ROBOTS_INVALID"
    );
    await expectAppError(
      seoService.createPageSeo({ ...base, status: "live" as never }, "u"),
      "SEO_STATUS_INVALID"
    );
    await expectAppError(
      seoService.createPageSeo({ ...base, secondaryKeywords: Array.from({ length: 21 }, (_, i) => `k${i}`) }, "u"),
      "SEO_TOO_MANY_KEYWORDS"
    );
  });

  it("accepts a site-relative og image and an absolute canonical", async () => {
    vi.mocked(seoRepository.findByRoute).mockResolvedValue(null);
    vi.mocked(seoRepository.create).mockImplementation(async (data) => ({
      ...(data as PageSeoRecord),
      _id: new Types.ObjectId(),
    }));

    await seoService.createPageSeo(
      {
        route: "/about",
        title: "t",
        description: "d",
        ogImage: "/uploads/common/x.webp",
        canonicalUrl: "https://casachicinterior.com/about",
      },
      "u"
    );
    expect(seoRepository.create).toHaveBeenCalledTimes(1);
  });
});

describe("updatePageSeo", () => {
  it("returns 404 for an unknown id", async () => {
    vi.mocked(seoRepository.findById).mockResolvedValue(null);
    await expectAppError(
      seoService.updatePageSeo(existingId.toString(), { title: "x" }, "u"),
      "SEO_NOT_FOUND",
      404
    );
  });

  it("rejects an invalid id", async () => {
    await expectAppError(seoService.updatePageSeo("nope", { title: "x" }, "u"), "SEO_INVALID_ID");
  });

  it("only writes the provided fields and stamps updatedBy", async () => {
    vi.mocked(seoRepository.findById).mockResolvedValue(existing);
    vi.mocked(seoRepository.updateById).mockResolvedValue({ ...existing, title: "New" });

    await seoService.updatePageSeo(existingId.toString(), { title: "  New  " }, "admin-2");

    const [, patch] = vi.mocked(seoRepository.updateById).mock.calls[0];
    expect(patch).toEqual({ title: "New", updatedBy: "admin-2" });
  });

  it("validates the merged record so a partial update cannot publish an empty title", async () => {
    vi.mocked(seoRepository.findById).mockResolvedValue({ ...existing, title: "", status: "draft" });

    await expectAppError(
      seoService.updatePageSeo(existingId.toString(), { status: "published" }, "u"),
      "SEO_TITLE_REQUIRED"
    );
    expect(seoRepository.updateById).not.toHaveBeenCalled();
  });

  it("blocks moving an entry onto a route that another entry already uses", async () => {
    vi.mocked(seoRepository.findById).mockResolvedValue(existing);
    vi.mocked(seoRepository.findByRoute).mockResolvedValue({
      ...existing,
      _id: new Types.ObjectId(),
      route: "/contact",
    });

    await expectAppError(
      seoService.updatePageSeo(existingId.toString(), { route: "/contact" }, "u"),
      "SEO_ROUTE_DUPLICATE",
      409
    );
  });

  it("drops a secondary keyword that equals the new primary keyword", async () => {
    vi.mocked(seoRepository.findById).mockResolvedValue(existing);
    vi.mocked(seoRepository.updateById).mockResolvedValue(existing);

    await seoService.updatePageSeo(
      existingId.toString(),
      { primaryKeyword: "Home Interiors", secondaryKeywords: ["home interiors", "wardrobes"] },
      "u"
    );

    const [, patch] = vi.mocked(seoRepository.updateById).mock.calls[0];
    expect(patch).toMatchObject({ primaryKeyword: "Home Interiors", secondaryKeywords: ["wardrobes"] });
  });
});

describe("public reads", () => {
  it("getPublishedPageSeoByRoute returns only published entries", async () => {
    vi.mocked(seoRepository.findByRoute).mockResolvedValue({ ...existing, status: "draft" });
    expect(await seoService.getPublishedPageSeoByRoute("/about")).toBeNull();

    vi.mocked(seoRepository.findByRoute).mockResolvedValue({ ...existing, status: "disabled" });
    expect(await seoService.getPublishedPageSeoByRoute("/about")).toBeNull();

    vi.mocked(seoRepository.findByRoute).mockResolvedValue(existing);
    expect(await seoService.getPublishedPageSeoByRoute("/about")).toEqual(existing);
  });

  it("normalises the route before looking it up", async () => {
    vi.mocked(seoRepository.findByRoute).mockResolvedValue(existing);
    await seoService.getPageSeoByRoute("About/");
    expect(seoRepository.findByRoute).toHaveBeenCalledWith("/about");
  });
});

describe("deletePageSeo", () => {
  it("rejects an invalid id and passes a valid one through", async () => {
    await expectAppError(seoService.deletePageSeo("bad"), "SEO_INVALID_ID");

    vi.mocked(seoRepository.deleteById).mockResolvedValue(true);
    expect(await seoService.deletePageSeo(existingId.toString())).toBe(true);
  });
});
