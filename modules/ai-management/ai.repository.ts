import { AiProvider, IAiProvider } from "./ai-provider.model";
import { AiUsage, IAiUsage } from "./ai-usage.model";
import { AiLimitEvent, IAiLimitEvent } from "./ai-limit.model";
import { AiSettings, IAiSettings } from "./ai-settings.model";

export const aiRepository = {
  async getSettings(): Promise<IAiSettings> {
    return AiSettings.findOneAndUpdate(
      { singletonKey: "GLOBAL" },
      { $setOnInsert: { isAiPaused: false } },
      { new: true, upsert: true }
    ).exec();
  },
  
  async updateSettings(isAiPaused: boolean): Promise<IAiSettings> {
    return AiSettings.findOneAndUpdate(
      { singletonKey: "GLOBAL" },
      { $set: { isAiPaused } },
      { new: true, upsert: true }
    ).exec();
  },

  async getActiveProvider(): Promise<IAiProvider | null> {
    return AiProvider.findOne({ isActive: true }).exec();
  },

  async getAllProviders(): Promise<IAiProvider[]> {
    return AiProvider.find().sort({ createdAt: -1 }).exec();
  },

  async getProviderByName(providerName: string): Promise<IAiProvider | null> {
    return AiProvider.findOne({ provider: providerName }).exec();
  },

  async upsertProvider(provider: string, data: Partial<IAiProvider>): Promise<IAiProvider> {
    // If setting to active, deactivate all others first
    if (data.isActive) {
      await AiProvider.updateMany({}, { isActive: false });
    }
    
    return AiProvider.findOneAndUpdate(
      { provider },
      { $set: data },
      { new: true, upsert: true }
    ).exec();
  },

  async deleteProvider(provider: string): Promise<void> {
    await AiProvider.deleteOne({ provider }).exec();
  },

  async logUsage(data: Partial<IAiUsage>): Promise<IAiUsage> {
    return AiUsage.create(data);
  },

  async logLimitEvent(data: Partial<IAiLimitEvent>): Promise<IAiLimitEvent> {
    return AiLimitEvent.create(data);
  },

  async getUsageStatsToday(): Promise<number> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const result = await AiUsage.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, totalTokens: { $sum: "$providerReportedTokens" } } }
    ]);
    
    return result.length > 0 ? result[0].totalTokens : 0;
  },

  async getUsageStatsThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await AiUsage.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, totalTokens: { $sum: "$providerReportedTokens" } } }
    ]);

    return result.length > 0 ? result[0].totalTokens : 0;
  }
};
