/***************************************************
 * File: modules/leads/lead.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Pure MongoDB operations for the Lead entity
 *
 * Responsibilities:
 * - findByPhone, create, updateByPhone, pushMessage, findAll
 * - Return plain objects using .lean()
 * - NO DTO logic or mapping here
 ***************************************************/
import mongoose from "mongoose";
import { LeadModel } from "./lead.model";
import { ILeadDB } from "./lead.types";

/**
 * Helper to ensure DB is connected before operations
 */
const ensureConnection = () => {
  if (mongoose.connection.readyState !== 1) {
    console.warn("[DB] Warning: Database operation attempted while readyState is", mongoose.connection.readyState);
  }
};

export const leadRepository = {
  async findAll(query?: { search?: string; status?: string }): Promise<ILeadDB[]> {
    ensureConnection();
    const filter: any = {};
    if (query?.status && query.status !== "all") {
      filter.status = query.status;
    }
    if (query?.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { phone: { $regex: query.search, $options: "i" } },
        { requirement: { $regex: query.search, $options: "i" } },
        { location: { $regex: query.search, $options: "i" } }
      ];
    }
    return await LeadModel.find(filter).sort({ lastActivityAt: -1, createdAt: -1 }).lean() as ILeadDB[];
  },

  async findByPhone(phone: string): Promise<ILeadDB | null> {
    ensureConnection();
    return await LeadModel.findOne({ phone }).lean() as ILeadDB | null;
  },

  async create(data: Partial<ILeadDB>): Promise<ILeadDB> {
    ensureConnection();
    const lead = await LeadModel.create(data);
    return lead.toObject() as ILeadDB;
  },

  async updateByPhone(phone: string, data: Partial<ILeadDB>): Promise<ILeadDB | null> {
    ensureConnection();
    return await LeadModel.findOneAndUpdate(
      { phone },
      { $set: data },
      { new: true }
    ).lean() as ILeadDB | null;
  },

  async pushMessage(phone: string, message: string): Promise<ILeadDB | null> {
    ensureConnection();
    return await LeadModel.findOneAndUpdate(
      { phone },
      { $push: { messages: message }, $set: { updatedAt: new Date() } },
      { new: true }
    ).lean() as ILeadDB | null;
  },

  async deleteByPhone(phone: string): Promise<boolean> {
    ensureConnection();
    const result = await LeadModel.deleteOne({ phone });
    return result.deletedCount > 0;
  },

  async bulkUpdate(phones: string[], data: Partial<ILeadDB>): Promise<any> {
    ensureConnection();
    return await LeadModel.updateMany(
      { phone: { $in: phones } },
      { $set: { ...data, updatedAt: new Date(), lastActivityAt: new Date() } }
    );
  },

  async getStats(): Promise<any> {
    ensureConnection();
    const [totalCount, newCount, qualifiedCount, convertedCount, manualCount, autoCount] = await Promise.all([
      LeadModel.countDocuments({}),
      LeadModel.countDocuments({ status: "NEW" }),
      LeadModel.countDocuments({ status: "QUALIFIED" }),
      LeadModel.countDocuments({ status: "CONVERTED" }),
      LeadModel.countDocuments({ automationMode: "MANUAL" }),
      LeadModel.countDocuments({ automationMode: "AUTO" })
    ]);
    return { total: totalCount, new: newCount, qualified: qualifiedCount, converted: convertedCount, manual: manualCount, auto: autoCount };
  }
};
