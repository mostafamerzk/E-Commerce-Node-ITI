import { stripe } from "../../utils/stripe/stripe.js";
import { Order } from "../../DB/Models/order.js";
import { Product } from "../../DB/Models/product.js";
import { orderEvent } from "../../utils/email/email.event.js";
import {
  orderStatus,
  paymentMethods,
  paymentStatus,
} from "../../utils/enums/enums.js";

export const createCheckoutSession = async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findOne({ _id: orderId, userId: req.user._id });
  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));
  }
  // if order status is not pending
  if (order.orderStatus !== orderStatus.pending) {
    return next(new Error("Order is not pending", { cause: 400 }));
  }
  // if order payment status is paid or refunded
  if (
    order.paymentStatus === paymentStatus.paid ||
    order.paymentStatus === paymentStatus.refunded
  ) {
    return next(new Error("Order is already paid or refunded", { cause: 400 }));
  }
  if (order.paymentMethod !== paymentMethods.creditCard) {
    return next(new Error("Order is not paid by credit card", { cause: 400 }));
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    metadata: { orderId: orderId.toString() },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
    cancel_url:
      process.env.CANCEL_URL ||
      "https://e-commrece-client-five.vercel.app/payment/cancel",
    success_url:
      process.env.SUCCESS_URL ||
      "https://e-commrece-client-five.vercel.app/payment/success",
    line_items: order.products.map((product) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
          },
          unit_amount: product.unitPrice * 100, // Amount in cents
        },
        quantity: product.quantity,
      };
    }),
  });

  order.stripeSessionId = session.id;
  await order.save();

  return res.status(200).json({
    message: "Checkout session created",
    url: session.url,
  });
};

export const handleWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Now contains raw Buffer from express.raw
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === paymentStatus.paid) {
      return res.status(200).json({ received: true });
    }

    // Deduct stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    order.paymentStatus = paymentStatus.paid;
    order.orderStatus = orderStatus.confirmed;
    order.paidAt = new Date();
    await order.save();

    // Fetch receipt URL from Stripe
    let receiptUrl = "";
    try {
      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent,
        );
        if (paymentIntent.latest_charge) {
          const charge = await stripe.charges.retrieve(
            paymentIntent.latest_charge,
          );
          receiptUrl = charge.receipt_url;
        }
      }
    } catch (error) {
      console.error("Error fetching Stripe receipt:", error);
    }

    // Send payment success email
    const populatedOrder = await Order.findById(orderId).populate("userId");
    if (populatedOrder && populatedOrder.userId) {
      orderEvent.emit(
        "paymentSuccess",
        populatedOrder.userId.email,
        populatedOrder,
        receiptUrl,
      );
    }

    console.log(`Order ${order._id} paid and stock deducted successfully`);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, orderStatus: orderStatus.pending },
      { orderStatus: orderStatus.cancelled },
      { new: true },
    ).populate("userId");

    if (order && order.userId) {
      // Send cancellation email
      orderEvent.emit(
        "orderStatusUpdate",
        order.userId.email,
        order,
        orderStatus.cancelled,
      );
      console.log(`Order ${orderId} cancelled due to session expiration`);
    }
  }

  return res.status(200).json({ received: true });
};
