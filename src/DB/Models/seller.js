import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  storeName: {
    type: String,
    required: true
  },
  storeDescription: String,
  storeImage: String
}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);