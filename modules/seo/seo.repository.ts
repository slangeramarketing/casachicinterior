/***************************************************
 * File: modules/seo/seo.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Database operations for page SEO entries
 *
 * Restrictions:
 * - Returns plain objects only (.lean())
 * - No business logic, no DTOs
 ***************************************************/

import { Types } from "mongoose";
import { PageSeoModel } from "./seo.model";
import { PageSeoRecord, PageSeoStatus } from "./seo.types";
import { AppError } from "@/lib/errors";

function assertValidId(id: string, code: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError({
      message: "Invalid SEO entry id",
      code,
      statusCode: 400,
      context: { id },
    });
  }
}

export const seoRepository = {
  async create(data: Partial<PageSeoRecord>): Promise<PageSeoRecord> {
    try {
      const doc = await PageSeoModel.create(data);
      return doc.toObject();
    } catch (err) {
      throw new AppError({
        message: "Failed to create SEO entry",
        code: "SEO_CREATE_FAILED",
        statusCode: 500,
        context: { route: data.route },
        cause: err,
      });
    }
  },

  async findById(id: string): Promise<PageSeoRecord | null> {
    assertValidId(id, "SEO_INVALID_ID");
    return PageSeoModel.findById(id).lean<PageSeoRecord>().exec();
  },

  async findByRoute(route: string): Promise<PageSeoRecord | null> {
    if (!route) return null;
    return PageSeoModel.findOne({ route }).lean<PageSeoRecord>().exec();
  },

  async findAll(filter: { status?: PageSeoStatus } = {}): Promise<PageSeoRecord[]> {
    const query: Record<string, unknown> = {};
    if (filter.status) query.status = filter.status;

    return PageSeoModel.find(query)
      .sort({ route: 1 })
      .lean<PageSeoRecord[]>()
      .exec();
  },

  async updateById(
    id: string,
    data: Partial<PageSeoRecord>
  ): Promise<PageSeoRecord | null> {
    assertValidId(id, "SEO_INVALID_ID");

    try {
      return await PageSeoModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      )
        .lean<PageSeoRecord>()
        .exec();
    } catch (err) {
      throw new AppError({
        message: "Failed to update SEO entry",
        code: "SEO_UPDATE_FAILED",
        statusCode: 500,
        context: { id },
        cause: err,
      });
    }
  },

  async deleteById(id: string): Promise<boolean> {
    assertValidId(id, "SEO_INVALID_ID");
    const res = await PageSeoModel.findByIdAndDelete(id).exec();
    return !!res;
  },
};
