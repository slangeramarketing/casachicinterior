/***************************************************
 * File: modules/services/service.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Contains all business logic for Service module
 *
 * Responsibilities:
 * - Validation
 * - Domain rules
 * - Choosing repository methods
 *
 * Restrictions:
 * - Must NOT format response
 * - Must NOT return DTOs
 * - Must NOT access HTTP, cookies, or Next.js APIs
 ***************************************************/
/***************************************************
 * File: modules/services/service.service.ts
 * Layer: Service
 ***************************************************/

import db from "@/lib/db";
import { Types } from "mongoose";
import { serviceRepository } from "./service.repository";
import { ServiceRecord, ServiceWithPopulatedCategory } from "./service.types";
import {
  AppError,
  DatabaseError,
  InvalidIdError,
} from "@/lib/errors";

/* ================================
   CREATE SERVICE
================================ */

export async function createService(
  data: Partial<ServiceRecord>
): Promise<ServiceRecord> {
  await db();

  if (!data.slug) {
    throw new AppError({
      message: "Slug is required",
      code: "VALIDATION_ERROR",
      statusCode: 400,
      context: { field: "slug" },
    });
  }

  try {
    const existing = await serviceRepository.findBySlug(data.slug);
    if (existing) {
      throw new AppError({
        message: "Service with this slug already exists",
        code: "DUPLICATE_SLUG",
        statusCode: 409,
        context: { slug: data.slug },
      });
    }

    return await serviceRepository.create({
      ...data,
      status: data.status || "draft",
      highlights: data.highlights || [],
      faqs: data.faqs || [],
    });
  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new DatabaseError("Failed to create service", {
      slug: data.slug,
    }, err);
  }
}

/* ================================
   GET BY ID
================================ */

export async function getServiceById(
  id: string
): Promise<ServiceWithPopulatedCategory | null> {
  await db();

  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidIdError("Invalid service ID", { id });
  }

  try {
    return await serviceRepository.findById(id);
  } catch (err) {
    throw new DatabaseError("Failed to fetch service by ID", { id }, err);
  }
}

/* ================================
   GET BY SLUG (PUBLIC)
================================ */

export async function getServiceBySlug(
  slug: string
): Promise<ServiceWithPopulatedCategory | null> {
  await db();

  try {
    const service = await serviceRepository.findBySlug(slug);

    if (!service || service.status !== "published") {
      return null;
    }

    return service;
  } catch (err) {
    throw new DatabaseError("Failed to fetch service by slug", { slug }, err);
  }
}

/* ================================
   LIST SERVICES
================================ */

export async function listServices(options?: {
  publicOnly?: boolean;
  categoryId?: string;
  featured?: boolean;
  limit?: number;
}): Promise<ServiceWithPopulatedCategory[]> {
  await db();

  const filter: any = {};

  filter.status = options?.publicOnly
    ? "published"
    : { $in: ["draft", "published"] };

  if (options?.categoryId) {
    if (!Types.ObjectId.isValid(options.categoryId)) {
      throw new InvalidIdError("Invalid category ID", {
        categoryId: options.categoryId,
      });
    }
    filter.categoryId = options.categoryId;
  }

  if (typeof options?.featured === "boolean") {
    filter.featured = options.featured;
  }

  try {
    return await serviceRepository.findAll(filter, {
      limit: options?.limit,
    });
  } catch (err) {
    throw new DatabaseError("Failed to list services", { filter }, err);
  }
}

/* ================================
   UPDATE SERVICE
================================ */

export async function updateService(
  id: string,
  data: Partial<ServiceRecord>
): Promise<ServiceWithPopulatedCategory | null> {
  await db();

  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidIdError("Invalid service ID", { id });
  }

  try {
    if (data.slug) {
      const existing = await serviceRepository.findBySlug(data.slug);
      if (existing && existing._id.toString() !== id) {
        throw new AppError({
          message: "Slug already in use by another service",
          code: "DUPLICATE_SLUG",
          statusCode: 409,
          context: { slug: data.slug },
        });
      }
    }

    return await serviceRepository.updateById(id, data);
  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new DatabaseError("Failed to update service", { id, data }, err);
  }
}

/* ================================
   DELETE SERVICE
================================ */

export async function deleteService(id: string): Promise<boolean> {
  await db();

  if (!Types.ObjectId.isValid(id)) {
    throw new InvalidIdError("Invalid service ID", { id });
  }

  try {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new AppError({
        message: "Service not found",
        code: "NOT_FOUND",
        statusCode: 404,
        context: { id },
      });
    }

    return await serviceRepository.deleteById(id);
  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new DatabaseError("Failed to delete service", { id }, err);
  }
}
