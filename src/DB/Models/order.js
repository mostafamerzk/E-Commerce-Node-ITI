import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  orderStatus,
  paymentStatus,
  paymentMethods,
} from "../../utils/enums/enums.js";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        discount: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        mainImage: {
          secure_url: { type: String },
          public_id: { type: String },
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: Object.values(paymentMethods),
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(paymentStatus),
      default: paymentStatus.unpaid,
    },
    orderStatus: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.pending,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    stripeSessionId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupons",
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);
orderSchema.plugin(mongoosePaginate);

export const Order = mongoose.model("Orders", orderSchema);
