import mongoose from "mongoose";
import { User } from "../../DB/Models/user.js"; // صحح المسار حسب مشروعك
const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
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