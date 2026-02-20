import { Router } from "express";
import * as paymentService from "./payment.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as paymentSchemas from "./payment.validation.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import express from "express";

const paymentRouter = Router();

paymentRouter
  .route("/create-checkout-session")
  .post(
    isAuthenticated,
    validation(paymentSchemas.createCheckoutSession),
    asyncHandler(paymentService.createCheckoutSession),
  );

// Webhook is registered under /payment/webhook
paymentRouter
  .route("/webhook")
  .post(asyncHandler(paymentService.handleWebhook));

export default paymentRouter;
