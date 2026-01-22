import mongoose, { Schema, models, model } from "mongoose";

/***************************************************
 * Layer: Model
 * Context: Interior Design Project
 * Purpose: Feedback for Services (Kitchen, Wardrobe, etc.)
 ***************************************************/

const ReviewSchema = new Schema(
  {
    // --- Client Details ---
    clientName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    clientEmail: { 
      type: String, 
      required: true, 
      trim: true, 
      lowercase: true 
    },
    // MD5 Gravatar ke liye ya client ki photo ke liye
    clientAvatar: { 
      type: String,
      default: ""
    },
    clientLocation: { 
      type: String, 
      placeholder: "e.g. Mumbai, BKC" // Interior projects mein location matter karti hai
    },

    // --- Connections (Interior Context) ---
    // Kis service ke liye design kiya gaya (e.g., Living Room Design)
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service", 
      required: true,
      index: true
    },
    // Future expansion: Jab project module banega (e.g., "The Sharma Villa")
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: false,
      index: true
    },

    // --- Review Content ---
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5,
      default: 5 
    },
    message: { 
      type: String, 
      required: true, 
      trim: true,
      maxLength: 1000 
    },

    // --- Admin Control & Workflow ---
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending",
      index: true 
    },
    isFeatured: { 
      type: Boolean, 
      default: false, // Kya isse Homepage slider pe dikhana hai?
      index: true 
    },
    
    // Admin response (e.g. "Thank you for choosing our design services!")
    adminResponse: { 
      type: String, 
      trim: true 
    },

    // --- Security & Link Generation ---
    // Private link generate karne ke liye unique token
    reviewToken: {
      type: String,
      unique: true,
      sparse: true 
    },
    // Token kab expire hoga (Optional: for security)
    expiresAt: {
      type: Date
    }
  },
  { 
    timestamps: true 
  }
);

// Performance Indexing
// Client email aur service ke basis par fast search ke liye
ReviewSchema.index({ clientEmail: 1, serviceId: 1 });
ReviewSchema.index({ createdAt: -1 });

export const ReviewModel = models.Review || model("Review", ReviewSchema);