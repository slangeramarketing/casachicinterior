"use server";

import { aiRepository } from "@/modules/ai-management/ai.repository";
import { aiCrypto } from "@/modules/ai-management/ai.crypto";
import { revalidatePath } from "next/cache";

// Need to safely connect to DB if not already connected, but assuming Server Actions 
// in this project already rely on the existing mongoose connection (as seen in lead.action.ts)

export async function getAiStatsAction() {
  try {
    const activeProvider = await aiRepository.getActiveProvider();
    const todayTokens = await aiRepository.getUsageStatsToday();
    const monthTokens = await aiRepository.getUsageStatsThisMonth();

    return {
      success: true,
      data: {
        activeProvider: activeProvider ? {
          provider: activeProvider.provider,
          model: activeProvider.model,
          expiresAt: activeProvider.expiresAt,
          dailyLimit: activeProvider.dailyLimit,
          monthlyLimit: activeProvider.monthlyLimit,
        } : null,
        todayTokens,
        monthTokens
      }
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAllProvidersAction() {
  try {
    const providers = await aiRepository.getAllProviders();
    const mapped = providers.map(p => ({
      provider: p.provider,
      model: p.model,
      isActive: p.isActive,
      expiresAt: p.expiresAt,
      dailyLimit: p.dailyLimit,
      monthlyLimit: p.monthlyLimit,
      rpm: p.rpm,
      maskedKey: aiCrypto.maskKey(aiCrypto.decrypt(p.encryptedKey) || "")
    }));
    return { success: true, data: mapped };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function saveProviderAction(payload: {
  provider: string;
  model: string;
  apiKey?: string; // Optional if just updating limits
  isActive: boolean;
  expiresAt?: Date;
  dailyLimit?: number;
  monthlyLimit?: number;
  rpm?: number;
}) {
  try {
    const updateData: any = {
      model: payload.model,
      isActive: payload.isActive,
      expiresAt: payload.expiresAt,
      dailyLimit: payload.dailyLimit,
      monthlyLimit: payload.monthlyLimit,
      rpm: payload.rpm
    };

    if (payload.apiKey) {
      updateData.encryptedKey = aiCrypto.encrypt(payload.apiKey);
    }

    await aiRepository.upsertProvider(payload.provider, updateData);
    revalidatePath("/admin/ai");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
export async function getLimitEventsAction(limit = 50) {
  try {
    const { AiLimitEvent } = await import("@/modules/ai-management/ai-limit.model");
    const events = await AiLimitEvent.find().sort({ createdAt: -1 }).limit(limit).exec();
    return { success: true, data: JSON.parse(JSON.stringify(events)) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function toggleAiPauseAction(isPaused: boolean) {
  try {
    const settings = await aiRepository.updateSettings(isPaused);
    revalidatePath("/admin/ai");
    return { success: true, data: { isAiPaused: settings.isAiPaused } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getSettingsAction() {
  try {
    const settings = await aiRepository.getSettings();
    return { success: true, data: { isAiPaused: settings.isAiPaused } };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
export async function deleteProviderAction(provider: string) {
  try {
    await aiRepository.deleteProvider(provider);
    revalidatePath("/admin/ai");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getAiUsageAction(limit = 50) {
  try {
    const { AiUsage } = await import("@/modules/ai-management/ai-usage.model");
    const usage = await AiUsage.find().sort({ createdAt: -1 }).limit(limit).exec();
    return { success: true, data: JSON.parse(JSON.stringify(usage)) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
