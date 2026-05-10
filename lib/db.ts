import mongoose from "mongoose";
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

/**
 * File: lib/db.ts
 * Purpose: Centralized MongoDB connection management using Mongoose.
 * 
 * Features:
 * - Connection singleton for Next.js (prevents multiple connections in HMR)
 * - Structured production logging with [DB] prefix
 * - Fast fail with bufferCommands: false
 * - Reusable connection promise
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage in production as well.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
    // Skip DB connection during Next.js build phase
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
        return mongoose;
    }

    // 1. If we have a cached connection, reuse it
    if (cached.conn) {
        console.log("[DB] Reusing Existing MongoDB Connection");
        return cached.conn;
    }

    // 2. If no promise exists, create a new one
    if (!cached.promise) {
        const opts = {
            dbName: "casachic_staging_db", // Explicit DB selection
            bufferCommands: false,         // Fail fast if connection is not ready
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            family: 4,                      // Force IPv4
            directConnection: true,         // Skip replica set discovery for speed
        };

        console.log("[DB] Connecting MongoDB...");
        
        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log("[DB] MongoDB Connected Successfully");
            return mongoose;
        }).catch((err) => {
            console.error("[DB] MongoDB Connection Error:", err.message);
            cached.promise = null; // Reset promise so next attempt can retry
            throw err;
        });
    }

    // 3. Await the promise and cache the connection
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
