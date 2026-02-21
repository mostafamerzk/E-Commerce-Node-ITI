import { stripe } from "../../utils/stripe/stripe.js";
import { Order } from "../../DB/Models/order.js";
import { orderStatus, paymentStatus } from "../../utils/enums/enums.js";

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

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    metadata: { orderId: orderId.toString() },
    cancel_url: process.env.CANCEL_URL || "http://localhost:3000/cancel",
    success_url: process.env.SUCCESS_URL || "http://localhost:3000/success",
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
    const order = await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        paymentStatus: paymentStatus.paid,
        orderStatus: orderStatus.confirmed,
      },
      { new: true },
    );

    if (!order) {
      console.error(`Order not found for session ${session.id}`);
    } else {
      console.log(`Order ${order._id} paid successfully`);
    }
  }

  return res.status(200).json({ received: true });
};
