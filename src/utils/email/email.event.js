import { EventEmitter } from "events";
import sendEmail, { Subjects } from "./sendEmail.js";
import { html, paymentReceiptHTML, cancellationHTML } from "./generateHTML.js";
import { generateToken } from "../token/token.js";
import { orderStatus } from "../enums/enums.js";

export const activateAcc = new EventEmitter();

activateAcc.on("activateAcc", async (email, subject) => {
  const token = generateToken({ payload: { email } });
  const link = `https://e-commerce-node-iti.vercel.app/auth/acctivate_account/${token}`;
  await sendEmail(email, subject, { html: html(link) });
});

activateAcc.on("verifyUpdatedEmail", async (email, id, subject) => {
  const token = generateToken({ payload: { email, id } });
  const link = `https://e-commerce-node-iti.vercel.app/user/verifyUpdatedEmail/${token}`;
  await sendEmail(email, subject, { html: html(link) });
});

export const orderEvent = new EventEmitter();

orderEvent.on("orderConfirmation", async (email, orderNumber, total) => {
  const subject = "Order Confirmation";
  const content = {
    html: `<h1>Order Confirmed!</h1><p>Your order ${orderNumber} has been placed successfully.</p><p>Total: ${total} EGP</p>`,
  };
  await sendEmail(email, subject, content);
});

orderEvent.on("paymentSuccess", async (email, order, receiptUrl) => {
  const subject = `Payment Receipt for Order #${order.orderNumber}`;
  const content = {
    html: paymentReceiptHTML(order, receiptUrl),
  };
  await sendEmail(email, subject, content);
});

orderEvent.on("orderStatusUpdate", async (email, order, status) => {
  const subject = `Order Status Update: ${status}`;
  let content;

  if (status === orderStatus.cancelled) {
    content = {
      html: cancellationHTML(order),
    };
  } else {
    content = {
      html: `<h1>Order Update</h1><p>Your order ${order.orderNumber} status has been updated to: <b>${status}</b></p>`,
    };
  }
  await sendEmail(email, subject, content);
});
