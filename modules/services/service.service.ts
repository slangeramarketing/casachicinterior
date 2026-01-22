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
// modules/services/service.service.ts

import { Types } from "mongoose";
import { serviceRepository } from "./service.repository";
import { ServiceRecord, ServiceWithPopulatedCategory } from "./service.types";
import db from "@/lib/db";

export async function createService(data: Partial<ServiceRecord>): Promise<ServiceRecord> {
  await db();
  if (!data.slug) throw new Error("Slug is required");
  
  const existing = await serviceRepository.findBySlug(data.slug);
  if (existing) throw new Error("Service with this slug already exists");

  return serviceRepository.create({
    ...data,
    status: data.status || "draft",
    highlights: data.highlights || [],
    faqs: data.faqs || [],
  });
}

/**
 * Get Service by ID (Populated)
 */
export async function getServiceById(id: string): Promise<ServiceWithPopulatedCategory | null> {
  await db();
  return serviceRepository.findById(id);
}

/**
 * Get Service by Slug (Populated)
 */
export async function getServiceBySlug(slug: string): Promise<ServiceWithPopulatedCategory | null> {
  await db();
  const service = await serviceRepository.findBySlug(slug);

  if (!service || service.status !== "published") return null;
  return service;
}

/**
 * List Services (Populated for both Admin & Public)
 */
export async function listServices(options?: {
  publicOnly?: boolean;
  categoryId?: string;
  featured?: boolean;
  limit?: number;
}): Promise<ServiceWithPopulatedCategory[]> {
  await db();
  
  const filter: any = {};
  if (options?.publicOnly) {
    filter.status = "published";
  } else {
    filter.status = { $in: ["draft", "published"] };
  }

  if (options?.categoryId) {
    filter.categoryId =options.categoryId;
  }

  if (typeof options?.featured === "boolean") {
    filter.featured = options.featured;
  }

  return serviceRepository.findAll(filter, { limit: options?.limit });
}

export async function updateService(id: string, data: Partial<ServiceRecord>): Promise<ServiceWithPopulatedCategory | null> {
  await db();
  if (data.slug) {
    const existing = await serviceRepository.findBySlug(data.slug);
    if (existing && existing._id.toString() !== id) {
      throw new Error("New slug is already taken");
    }
  }
  return serviceRepository.updateById(id, data);
}

export async function deleteService(id: string): Promise<boolean> {
  await db();
  const service = await serviceRepository.findById(id);
  if (!service) throw new Error("Service not found");
  return serviceRepository.deleteById(id);
}