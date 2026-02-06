import mongoose from "mongoose";
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

// global का इस्तेमाल करें ताकि रि-रेंडर होने पर कनेक्शन न टूटे
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function db(): Promise<void> {
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
        console.log("Skipping DB connection during build phase...");
        return;
    }

    if (cached.conn) {
        console.log("Using cached connection");
        return;
    }

    const uri = process.env.MONGODB_URI;
    console.log("Checking URI:", uri?.replace(/:([^:@]+)@/, ':****@')); // पासवर्ड छुपाकर URI प्रिंट करें


    if (!uri) {
        throw new Error("MONGODB_URI is missing in .env file");
    }

    if (!cached.promise) {
        const opts = {
            dbName: "casachic_staging_db",
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // 30s बहुत ज़्यादा है, 5s में फेल होने दें
            family: 4,                      // फोर्स करें कि सिर्फ IPv4 (127.0.0.1) ही यूज़ हो
            directConnection: true,         // क्लस्टर चेक छोड़कर सीधे कनेक्ट हो
        };


        console.log("New DB Connection Attempting...");
        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
            console.log("DB Connected Successfully");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("DB Connection Failed:", e);
        throw e;
    }
}

export default db;
