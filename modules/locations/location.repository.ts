/***************************************************
 * File: modules/locations/location.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Database operations for location pages
 *
 * Restrictions:
 * - Returns plain objects only (.lean())
 * - No business logic, no DTOs
 ***************************************************/

import { Types } from "mongoose";
import { LocationModel } from "./location.model";
import { LocationRecord, LocationStatus } from "./location.types";
import { AppError } from "@/lib/errors";

function assertValidId(id: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError({
      message: "Invalid location id",
      code: "LOCATION_INVALID_ID",
      statusCode: 400,
      context: { id },
    });
  }
}

export const locationRepository = {
  async create(data: Partial<LocationRecord>): Promise<LocationRecord> {
    try {
      const doc = await LocationModel.create(data);
      return doc.toObject();
    } catch (err) {
      throw new AppError({
        message: "Failed to create location page",
        code: "LOCATION_CREATE_FAILED",
        statusCode: 500,
        context: { slug: data.slug },
        cause: err,
      });
    }
  },

  async findById(id: string): Promise<LocationRecord | null> {
    assertValidId(id);
    return LocationModel.findById(id).lean<LocationRecord>().exec();
  },

  async findBySlug(slug: string): Promise<LocationRecord | null> {
    if (!slug) return null;
    return LocationModel.findOne({ slug }).lean<LocationRecord>().exec();
  },

  async findAll(filter: { status?: LocationStatus } = {}): Promise<LocationRecord[]> {
    const query: Record<string, unknown> = {};
    if (filter.status) query.status = filter.status;

    return LocationModel.find(query)
      .sort({ areaName: 1, title: 1 })
      .lean<LocationRecord[]>()
      .exec();
  },

  async updateById(id: string, data: Partial<LocationRecord>): Promise<LocationRecord | null> {
    assertValidId(id);

    try {
      return await LocationModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      )
        .lean<LocationRecord>()
        .exec();
    } catch (err) {
      throw new AppError({
        message: "Failed to update location page",
        code: "LOCATION_UPDATE_FAILED",
        statusCode: 500,
        context: { id },
        cause: err,
      });
    }
  },

  async deleteById(id: string): Promise<boolean> {
    assertValidId(id);
    const res = await LocationModel.findByIdAndDelete(id).exec();
    return !!res;
  },
};
