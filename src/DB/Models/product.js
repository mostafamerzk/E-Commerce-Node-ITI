import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "product title is required"],
      trim: true,
      minlength: [2, "title must be at least 2 characters"],
      maxlength: [200, "title must be at most 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "description must be at most 2000 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      min: [0, "price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "discount cannot be negative"],
      max: [100, "discount cannot exceed 100%"],
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "stock quantity is required"],
      min: [0, "stock cannot be negative"],
      default: 0,
    },
    mainImage: {
      secure_url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    images: [
      {
        secure_url: { type: String, default: "" },
        public_id: { type: String, default: "" },
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: [true, "category is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// auto-calculate finalPrice before saving
productSchema.pre("save", function (next) {
  if (this.isModified("price") || this.isModified("discount")) {
    this.finalPrice = this.price - (this.price * this.discount) / 100;
  }
  return next();
});

export const Product = mongoose.model("Products", productSchema);
