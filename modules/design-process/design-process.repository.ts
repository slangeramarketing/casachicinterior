/***************************************************
 * File: modules/design-process/design-process.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Direct DB access for DesignProcess
 *
 * Responsibilities:
 * - CRUD operations
 *
 * Restrictions:
 * - No business logic
 * - No DTOs
 ***************************************************/


import { DesignProcessModel } from "./design-process.model";
import { DesignProcessRecord } from "./design-process.types";

export const designProcessRepository = {
  /* =========================
     CREATE
  ========================= */
  async create(
    data: Partial<DesignProcessRecord>
  ): Promise<DesignProcessRecord> {
    const doc = await DesignProcessModel.create(data);
    return doc.toObject();
  },

  /* =========================
     UPDATE
  ========================= */
  async updateById(
    id: string,
    data: Partial<DesignProcessRecord>
  ): Promise<DesignProcessRecord | null> {
    return DesignProcessModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    ).lean();
  },

  /* =========================
     GET BY ID
  ========================= */
  async findById(
    id: string
  ): Promise<DesignProcessRecord | null> {
    return DesignProcessModel.findById(id).lean();
  },

  /* =========================
     GET ALL
  ========================= */
  async findAll(
    filter: Partial<DesignProcessRecord> = {}
  ): Promise<DesignProcessRecord[]> {
    return DesignProcessModel.find(filter)
      .sort({ stepOrder: 1 })
      .lean();
  },

  /* =========================
     GET BY SERVICE ID
  ========================= */
  async findByServiceId(
    serviceId: string,
    activeOnly = false
  ): Promise<DesignProcessRecord[]> {
    const filter: any = { serviceId };

    if (activeOnly) {
      filter.isActive = true;
    }

    return DesignProcessModel.find(filter)
      .sort({ stepOrder: 1 })
      .lean();
  },

  /* =========================
     DELETE
  ========================= */
  async deleteById(id: string): Promise<boolean> {
    const res = await DesignProcessModel.findByIdAndDelete(
      id
    );
    return Boolean(res);
  },
};
