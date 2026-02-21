import { Order } from "../../DB/Models/order.js";
import { Cart } from "../../DB/Models/cart.js";
import { Product } from "../../DB/Models/product.js";
import { nanoid } from "nanoid";
import {
  orderStatus,
  paymentStatus,
  paymentMethods,
} from "../../utils/enums/enums.js";
import { orderEvent } from "../../utils/email/email.event.js";

export const getCheckoutSummary = async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.products.length === 0) {
    return next(new Error("Cart is empty", { cause: 400 }));
  }

  // Basic summary calculation
  // In a real app, coupon validation would happen here
  const subtotal = cart.totalPrice;
  const shipping = 50; // Flat rate for now
  const discount = 0; // TBD based on coupon
  const total = subtotal + shipping - discount;

  return res.status(200).json({
    subtotal,
    shipping,
    discount,
    total,
  });
};

export const placeOrder = async (req, res, next) => {
  const { paymentMethod, shippingAddress, couponCode } = req.body;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.products.length === 0) {
    return next(new Error("Cart is empty", { cause: 400 }));
  }

  const orderProducts = [];
  for (const item of cart.products) {
    const product = await Product.findById(item.productId);
    if (!product || product.isDeleted) {
      return next(
        new Error(`Product ${item.productId} not found`, { cause: 404 }),
      );
    }

    if (product.stock < item.quantity) {
      return next(
        new Error(`Insufficient stock for product ${product.title}`, {
          cause: 400,
        }),
      );
    }

    orderProducts.push({
      productId: product._id,
      title: product.title,
      quantity: item.quantity,
      unitPrice: product.finalPrice || product.price,
    });
  }

  // Calculate totals again for security
  const subtotal = orderProducts.reduce(
    (acc, curr) => acc + curr.unitPrice * curr.quantity,
    0,
  );
  const shipping = 50;
  const discount = 0; // Coupon logic would go here
  const total = subtotal + shipping - discount;

  const order = await Order.create({
    userId: req.user._id,
    products: orderProducts,
    totalPrice: total,
    shippingAddress,
    paymentMethod,
    orderNumber: `ORD-${nanoid(10).toUpperCase()}`,
    paymentStatus:
      paymentMethod === paymentMethods.cod
        ? paymentStatus.unpaid
        : paymentStatus.unpaid, // Simplification
    orderStatus: orderStatus.pending,
  });

  // Deduct stock
  for (const item of cart.products) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear cart
  await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { products: [], totalPrice: 0 },
  );

  // Send email
  orderEvent.emit(
    "orderConfirmation",
    req.user.email,
    order.orderNumber,
    total,
  );

  return res.status(201).json({
    message: "Order placed successfully",
    order,
  });
};

export const getUserOrders = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const orders = await Order.paginate(
    { userId: req.user._id },
    { page, limit, sort: { createdAt: -1 } },
  );

  return res.status(200).json({
    message: "Orders fetched successfully",
    orders,
  });
};

export const getSingleOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, userId: req.user._id });

  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));
  }

  return res.status(200).json({
    message: "Order fetched successfully",
    order,
  });
};

export const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ _id: orderId, userId: req.user._id });

  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));
  }

  if (
    ![orderStatus.pending, orderStatus.confirmed].includes(order.orderStatus)
  ) {
    return next(
      new Error("Cannot cancel order in current status", { cause: 400 }),
    );
  }

  order.orderStatus = orderStatus.cancelled;
  await order.save();

  // Restore stock
  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity },
    });
  }

  // Send email
  orderEvent.emit(
    "orderStatusUpdate",
    req.user.email,
    order.orderNumber,
    orderStatus.cancelled,
  );

  return res.status(200).json({
    message: "Order cancelled successfully",
    order,
  });
};
