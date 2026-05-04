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
import { LeadModel } from "./lead.model";
import { ILeadDB } from "./lead.types";

export const leadRepository = {
  async findAll(query?: { search?: string; status?: string }): Promise<ILeadDB[]> {
    const filter: any = {};
    if (query?.status && query.status !== "all") {
      filter.status = query.status;
    }
    if (query?.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { phone: { $regex: query.search, $options: "i" } }
      ];
    }
    return await LeadModel.find(filter).sort({ createdAt: -1 }).lean() as ILeadDB[];
  },

  async findByPhone(phone: string): Promise<ILeadDB | null> {
    return await LeadModel.findOne({ phone }).lean() as ILeadDB | null;
  },

  async create(data: Partial<ILeadDB>): Promise<ILeadDB> {
    const lead = await LeadModel.create(data);
    return lead.toObject() as ILeadDB;
  },

  async updateByPhone(phone: string, data: Partial<ILeadDB>): Promise<ILeadDB | null> {
    return await LeadModel.findOneAndUpdate(
      { phone },
      { $set: data },
      { new: true }
    ).lean() as ILeadDB | null;
  },

  async pushMessage(phone: string, message: string): Promise<ILeadDB | null> {
    return await LeadModel.findOneAndUpdate(
      { phone },
      { $push: { messages: message }, $set: { updatedAt: new Date() } },
      { new: true }
    ).lean() as ILeadDB | null;
  },

  async deleteByPhone(phone: string): Promise<boolean> {
    const result = await LeadModel.deleteOne({ phone });
    return result.deletedCount > 0;
  }
};
