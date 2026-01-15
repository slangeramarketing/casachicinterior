/***************************************************
 * File: service-showcase.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Direct DB access for ServiceShowcase
 *
 * Rules:
 * - No business logic
 * - No DTOs
 ***************************************************/

import { Types } from "mongoose";
import { ServiceShowcaseModel } from "./service-showcase.model";
import { ServiceShowcaseRecord } from "./service-showcase.types";

function toRecord(doc: any): ServiceShowcaseRecord {
  return {
    id: doc._id.toString(),
    serviceId: doc.serviceId.toString(),

    title: doc.title,
    beforeImage: doc.beforeImage,
    afterImage: doc.afterImage,

    problem: doc.problem,
    solution: doc.solution,
    result: doc.result,

    displayOrder: doc.displayOrder,
    isActive: doc.isActive,

    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const serviceShowcaseRepository = {
  async create(
    data: Partial<ServiceShowcaseRecord>
  ): Promise<ServiceShowcaseRecord> {
    const doc = await ServiceShowcaseModel.create({
      ...data,
      serviceId: new Types.ObjectId(data.serviceId),
    });

    return toRecord(doc);
  },

  async updateById(
    id: string,
    data: Partial<ServiceShowcaseRecord>
  ): Promise<ServiceShowcaseRecord | null> {
    const doc = await ServiceShowcaseModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    return doc ? toRecord(doc) : null;
  },

  async findById(
    id: string
  ): Promise<ServiceShowcaseRecord | null> {
    const doc = await ServiceShowcaseModel.findById(id);
    return doc ? toRecord(doc) : null;
  },

  async findAll(): Promise<ServiceShowcaseRecord[]> {
    const docs = await ServiceShowcaseModel.find()
      .sort({ displayOrder: 1 });

    return docs.map(toRecord);
  },

  async findByServiceId(
    serviceId: string
  ): Promise<ServiceShowcaseRecord[]> {
    const docs = await ServiceShowcaseModel.find({
      serviceId: new Types.ObjectId(serviceId),
      isActive: true,
    }).sort({ displayOrder: 1 });

    return docs.map(toRecord);
  },

  async deleteById(id: string): Promise<boolean> {
    const res = await ServiceShowcaseModel.findByIdAndDelete(id);
    return !!res;
  },
};
