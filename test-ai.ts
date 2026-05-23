import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { aiRepository } from "./modules/ai-management/ai.repository";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const provider = await aiRepository.getActiveProvider();
  console.log("Active Provider:", provider?.provider);

  if (provider) {
    const todayTokens = await aiRepository.getUsageStatsToday();
    console.log("Today Tokens:", todayTokens);
    
    console.log("Daily Limit:", provider.dailyLimit);
    if (provider.dailyLimit && todayTokens >= provider.dailyLimit) {
      console.log("-> Limit exceeded!");
    } else {
      console.log("-> Within limits.");
    }

    if (provider.expiresAt && provider.expiresAt < new Date()) {
      console.log("-> Expired!");
    } else {
      console.log("-> Not expired.");
    }
  }

  process.exit(0);
}

run();
