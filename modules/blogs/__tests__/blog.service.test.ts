/***************************************************
 * File: modules/blogs/__tests__/blog.service.test.ts
 * Layer: Service Test
 *
 * Purpose:
 * - Tests business logic of blog.service.ts
 *
 * Restrictions:
 * - No real DB
 * - Repository must be mocked
 ***************************************************/

import { describe, it, expect, vi, beforeEach } from "vitest";
import { Types } from "mongoose";

import * as blogService from "../blog.service";
import { blogRepository } from "../blog.repository";
import type { IBlogRecord, IPopulatedBlogRecord } from "../blog.types";

/* ---------------- MOCK REPOSITORY ---------------- */

vi.mock("../blog.repository", () => ({
  blogRepository: {
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    incrementViews: vi.fn(),
  },
}));

/* ---------------- MOCK DATA ---------------- */

const blogId = new Types.ObjectId();

const mockBlog: IBlogRecord = {
  _id: blogId,
  title: "Modern Bedroom Design",
  slug: "modern-bedroom-design",
  summary: "Bedroom ideas",
  content:
    "This is a sample blog content with enough words to calculate reading time properly.",
  categoryId: new Types.ObjectId(),
  authorId: new Types.ObjectId(),
  tags: ["interior", "bedroom"],
  viewCount: 0,
  seo: {
    keywords: [],
    metaRobots: "index, follow",
  },
  status: "draft",
  featured: false,
  readingTime: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const populatedBlog: IPopulatedBlogRecord = {
  ...mockBlog,
  categoryId: {
    _id: new Types.ObjectId(),
    name: "Bedroom Interior",
    slug: "bedroom-interior",
  },
  authorId: {
    _id: new Types.ObjectId(),
    name: "Admin",
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Blog Service", () => {
  /* ---------------- GET ALL ---------------- */

  it("should return all blogs", async () => {
    vi.mocked(blogRepository.findAll).mockResolvedValue([populatedBlog]);

    const result = await blogService.getAllBlogs();

    expect(result.length).toBe(1);
  });

  /* ---------------- GET BY SLUG ---------------- */

  it("should get blog by slug and increment views", async () => {
    vi.mocked(blogRepository.findBySlug).mockResolvedValue(populatedBlog);
    vi.mocked(blogRepository.incrementViews).mockResolvedValue(undefined);

    const result = await blogService.getBlogBySlug("modern-bedroom-design");

    expect(result.slug).toBe("modern-bedroom-design");
    expect(blogRepository.incrementViews).toHaveBeenCalledWith(
      blogId.toString()
    );
  });

  it("should throw if blog not found by slug", async () => {
    vi.mocked(blogRepository.findBySlug).mockResolvedValue(null);

    await expect(
      blogService.getBlogBySlug("invalid-slug")
    ).rejects.toThrow("Blog not found");
  });

  /* ---------------- GET BY ID ---------------- */

  it("should get blog by id", async () => {
    vi.mocked(blogRepository.findById).mockResolvedValue(populatedBlog);

    const result = await blogService.getBlogById(blogId.toString());

    expect(result._id.toString()).toBe(blogId.toString());
  });

  it("should throw if blog not found by id", async () => {
    vi.mocked(blogRepository.findById).mockResolvedValue(null);

    await expect(
      blogService.getBlogById(blogId.toString())
    ).rejects.toThrow("Blog post not found with the provided ID");
  });

  /* ---------------- CREATE BLOG ---------------- */

  it("should create blog with readingTime", async () => {
    vi.mocked(blogRepository.findBySlug).mockResolvedValue(null);
    vi.mocked(blogRepository.create).mockResolvedValue(mockBlog);

    const result = await blogService.createBlog({
      title: mockBlog.title,
      slug: mockBlog.slug,
      content: mockBlog.content,
      categoryId: mockBlog.categoryId.toString(),
      authorId: mockBlog.authorId.toString(),
      tags: mockBlog.tags,
      status: "draft",
    });

    expect(result.readingTime).toBeGreaterThan(0);
  });

  it("should throw if slug already exists", async () => {
    // IMPORTANT: slug check only needs RAW record
    vi
      .mocked(
        blogRepository.findBySlug as unknown as () => Promise<IBlogRecord | null>
      )
      .mockResolvedValue(mockBlog);

    await expect(
      blogService.createBlog({
        title: "Test",
        slug: mockBlog.slug,
        content: "content",
        categoryId: mockBlog.categoryId.toString(),
        authorId: mockBlog.authorId.toString(),
        tags: [],
        status: "draft",
      })
    ).rejects.toThrow("Blog slug already exists");
  });

  /* ---------------- UPDATE BLOG ---------------- */

  it("should update blog and recalculate reading time", async () => {
    vi.mocked(blogRepository.findBySlug).mockResolvedValue(null);
    vi.mocked(blogRepository.update).mockResolvedValue(mockBlog);

    const result = await blogService.updateBlog(blogId.toString(), {
      content:
        "Updated content with more words so reading time changes correctly",
    });

    expect(result).toBeDefined();
  });

  it("should block slug update if already used by another blog", async () => {
    vi
      .mocked(
        blogRepository.findBySlug as unknown as () => Promise<IBlogRecord | null>
      )
      .mockResolvedValue({
        ...mockBlog,
        _id: new Types.ObjectId(),
      });

    await expect(
      blogService.updateBlog(blogId.toString(), {
        slug: "duplicate-slug",
      })
    ).rejects.toThrow("Slug is already taken by another blog");
  });

/* ---------------- DELETE BLOG ---------------- */

    it("should delete blog", async () => {
    vi.mocked(blogRepository.delete).mockResolvedValue(mockBlog);

    const result = await blogService.deleteBlog(blogId.toString());

    expect(result).toBe(true);
    });

});
