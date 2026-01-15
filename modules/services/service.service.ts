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

import { Types } from "mongoose";
import { serviceRepository } from "./service.repository";
import { ServiceRecord } from "./service.types";

/* =====================================================
   Create Service
===================================================== */
export async function createService(
  data: Partial<ServiceRecord>
): Promise<ServiceRecord> {
  const existing = await serviceRepository.findBySlug(
    data.slug!
  );
  if (existing) {
    throw new Error("Service with this slug already exists");
  }

  return serviceRepository.create(data);
}

/* =====================================================
   Get Service by ID
===================================================== */
export async function getServiceById(
  id: string
): Promise<ServiceRecord | null> {
  return serviceRepository.findById(id);
}

/* =====================================================
   Get Service by Slug (Public)
===================================================== */
export async function getServiceBySlug(
  slug: string
): Promise<ServiceRecord | null> {
  const service =
    await serviceRepository.findBySlug(slug);

  if (!service || service.status !== "published") {
    return null;
  }

  return service;
}

/* =====================================================
   List Services
===================================================== */
/* =====================================================
   List Services
===================================================== */
export async function listServices(options?: {
  publicOnly?: boolean;
  categoryId?: string;
  featured?: boolean;
  limit?: number;
}): Promise<ServiceRecord[]> {
  const filter: {
    status?: "draft" | "published";
    categoryId?: Types.ObjectId;
    featured?: boolean;
  } = {};

  if (options?.publicOnly) {
    filter.status = "published";
  }

  if (options?.categoryId) {
    filter.categoryId = new Types.ObjectId(options.categoryId);
  }

  if (typeof options?.featured === "boolean") {
    filter.featured = options.featured;
  }

  return serviceRepository.findAll(filter, {
    limit: options?.limit,
  });
}


/* =====================================================
   Update Service
===================================================== */
export async function updateService(
  id: string,
  data: Partial<ServiceRecord>
): Promise<ServiceRecord | null> {
  return serviceRepository.updateById(id, data);
}

/* =====================================================
   Delete Service
===================================================== */
export async function deleteService(
  id: string
): Promise<boolean> {
  return serviceRepository.deleteById(id);
}
