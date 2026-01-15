/***************************************************
 * File: modules/design-process/design-process.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Business logic for DesignProcess
 *
 * Responsibilities:
 * - Enforce domain rules
 * - Control ordering logic
 *
 * Restrictions:
 * - Must NOT return DTOs
 * - Must NOT format response
 * - Must NOT use object+method structure
 ***************************************************/

import { Types } from "mongoose";
import { designProcessRepository } from "./design-process.repository";
import { DesignProcessRecord } from "./design-process.types";

/* =====================================================
   CREATE
===================================================== */
export async function createDesignProcessService(
  data: {
    serviceId: string;
    title: string;
    description: string;
    icon?: string;
    stepOrder: number;
  }
): Promise<DesignProcessRecord> {
  return designProcessRepository.create({
    serviceId: new Types.ObjectId(data.serviceId),
    title: data.title,
    description: data.description,
    icon: data.icon,
    stepOrder: data.stepOrder,
    isActive: true,
  });
}

/* =====================================================
   UPDATE
===================================================== */
export async function updateDesignProcessService(
  id: string,
  data: Partial<DesignProcessRecord>
): Promise<DesignProcessRecord | null> {
  return designProcessRepository.updateById(id, data);
}

/* =====================================================
   GET BY ID
===================================================== */
export async function getDesignProcessByIdService(
  id: string
): Promise<DesignProcessRecord | null> {
  return designProcessRepository.findById(id);
}

/* =====================================================
   GET ALL
===================================================== */
export async function listDesignProcessesService(
  options?: {
    serviceId?: string;
    activeOnly?: boolean;
  }
): Promise<DesignProcessRecord[]> {
  if (options?.serviceId) {
    return designProcessRepository.findByServiceId(
      options.serviceId,
      options.activeOnly
    );
  }

  return designProcessRepository.findAll(
    options?.activeOnly
      ? { isActive: true }
      : {}
  );
}

/* =====================================================
   DELETE
===================================================== */
export async function removeDesignProcessService(
  id: string
): Promise<boolean> {
  return designProcessRepository.deleteById(id);
}
