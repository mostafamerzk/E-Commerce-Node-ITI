import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "category name must be at least 2 characters"],
      maxlength: [50, "category name must be at most 50 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: {
      secure_url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true },
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, replacement: "-" });
  }
  next();
});

export const Category = mongoose.model("Categories", categorySchema);
