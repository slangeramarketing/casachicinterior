import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { AiProvider } from "./modules/ai-management/ai-provider.model";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  
  await AiProvider.updateOne({ provider: "Nvidia" }, { $unset: { expiresAt: 1 } });
  console.log("Unset expiresAt for Nvidia");

  process.exit(0);
}

run();
