/***************************************************
 * File: service-showcase.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business logic for ServiceShowcase
 *
 * Rules:
 * - FUNCTION-BASED ONLY
 * - No object + method structure
 * - No DTOs
 ***************************************************/

import { ServiceShowcaseRecord } from "./service-showcase.types";
import { serviceShowcaseRepository } from "./service-showcase.repository";
import db from "@/lib/db";

/* =============================
   CREATE
============================= */
export async function createServiceShowcase(
  data: Partial<ServiceShowcaseRecord>
): Promise<ServiceShowcaseRecord> {
  await db();   // before mongoose queries;
  return serviceShowcaseRepository.create(data);
}

/* =============================
   UPDATE
============================= */
export async function updateServiceShowcase(
  id: string,
  data: Partial<ServiceShowcaseRecord>
): Promise<ServiceShowcaseRecord | null> {
  await db();   // before mongoose queries;
  return serviceShowcaseRepository.updateById(id, data);
}

/* =============================
   READ
============================= */
export async function getServiceShowcaseById(
  id: string
): Promise<ServiceShowcaseRecord | null> {
  await db();   // before mongoose queries;
  return serviceShowcaseRepository.findById(id);
}

export async function listServiceShowcases(): Promise<ServiceShowcaseRecord[]> {
  await db();   // before mongoose queries;
  return serviceShowcaseRepository.findAll();
}

export async function getServiceShowcasesByService(
  serviceId: string
): Promise<ServiceShowcaseRecord[]> {
  await db();   // before mongoose queries;
  return serviceShowcaseRepository.findByServiceId(serviceId);
}

/* =============================
   DELETE
============================= */
export async function removeServiceShowcase(
  id: string
): Promise<boolean> {
  await db();   // before mongoose queries;
  return serviceShowcaseRepository.deleteById(id);
}
