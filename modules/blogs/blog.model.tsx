import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    richText: String,
    thumbnailImage: String,

    category: String,
    subCategory: String,

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
    },

    publishedAt: Date,
  },
  { timestamps: true }
);

BlogSchema.pre("save", function () {
  if (this.isModified("status")) {
    this.publishedAt =
      this.status === "published" ? new Date() : undefined;
  }
});

export default mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);
