import { Schema, model, models, Document, Types } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  categoryId: Types.ObjectId; // Parent Category
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * 🔴 Important
 * One category can have multiple sub-categories,
 * but same slug should not repeat under same category
 */
SubCategorySchema.index({ slug: 1, category: 1 }, { unique: true });

export default models.SubCategory ||
  model<ISubCategory>("SubCategory", SubCategorySchema);
