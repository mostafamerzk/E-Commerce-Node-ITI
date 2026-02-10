import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "banner title is required"],
      trim: true,
      maxlength: [100, "title must be at most 100 characters"],
    },
    image: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    link: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true },
);

export const Banner = mongoose.model("Banners", bannerSchema);
