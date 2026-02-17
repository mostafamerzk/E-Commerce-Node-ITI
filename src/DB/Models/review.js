import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [1, "rating must be at least 1"],
      max: [5, "rating must be at most 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "comment must be at most 1000 characters"],
    },
    parentComment:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
      default: null
    }
  },
  { timestamps: true },
);

// one review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Review = mongoose.model("Reviews", reviewSchema);
