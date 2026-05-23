import { ContactRuleModel } from "./contact-rule.model";
import { IContactRuleDB } from "./contact-rule.types";
import connectDB from "@/lib/db";

export const contactRuleRepository = {
  async findByPhone(phone: string): Promise<IContactRuleDB | null> {
    await connectDB();
    const doc = await ContactRuleModel.findOne({ phone }).lean();
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as IContactRuleDB;
  },

  async upsert(data: Partial<IContactRuleDB> & { phone: string }): Promise<IContactRuleDB> {
    await connectDB();
    const doc = await ContactRuleModel.findOneAndUpdate(
      { phone: data.phone },
      { $set: data },
      { new: true, upsert: true }
    ).lean();
    return { ...doc, _id: doc._id.toString() } as IContactRuleDB;
  },

  async delete(phone: string): Promise<boolean> {
    await connectDB();
    const result = await ContactRuleModel.deleteOne({ phone });
    return result.deletedCount > 0;
  },

  async findAll(query?: any): Promise<IContactRuleDB[]> {
    await connectDB();
    const filter: any = {};
    if (query?.mode) filter.mode = query.mode;
    if (query?.label) filter.label = query.label;
    if (query?.search) {
      filter.$or = [
        { phone: { $regex: query.search, $options: "i" } },
        { notes: { $regex: query.search, $options: "i" } }
      ];
    }
    
    const docs = await ContactRuleModel.find(filter).sort({ createdAt: -1 }).lean();
    return docs.map(doc => ({ ...doc, _id: doc._id.toString() })) as IContactRuleDB[];
  },

  async bulkUpsert(rules: any[]): Promise<any> {
    await connectDB();
    const bulkOps = rules.map(rule => ({
      updateOne: {
        filter: { phone: rule.phone },
        update: { $set: rule },
        upsert: true
      }
    }));
    return await ContactRuleModel.bulkWrite(bulkOps);
  },

  async bulkDelete(phones: string[]): Promise<any> {
    await connectDB();
    return await ContactRuleModel.deleteMany({ phone: { $in: phones } });
  },

  async getStats(): Promise<any> {
    await connectDB();
    const [manualCount, autoCount, disabledCount, totalCount] = await Promise.all([
      ContactRuleModel.countDocuments({ mode: "MANUAL" }),
      ContactRuleModel.countDocuments({ mode: "AUTO" }),
      ContactRuleModel.countDocuments({ enabled: false }),
      ContactRuleModel.countDocuments({})
    ]);
    return {
      manual: manualCount,
      auto: autoCount,
      disabled: disabledCount,
      total: totalCount
    };
  }
};
