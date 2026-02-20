import mongoose from "mongoose";

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
  },
  { timestamps: true },
);

export const Order = mongoose.model("Orders", orderSchema);
