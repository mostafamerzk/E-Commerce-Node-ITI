import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  getCheckoutSummary,
  placeOrder,
  getUserOrders,
  getSingleOrder,
  cancelOrder,
} from "./order.service.js";
import {
  checkoutSummarySchema,
  placeOrderSchema,
  getUserOrdersSchema,
  orderIdSchema,
} from "./order.validation.js";

const orderRouter = Router();

orderRouter.post(
  "/checkout",
  isAuthenticated,
  validation(checkoutSummarySchema),
  asyncHandler(getCheckoutSummary),
);

orderRouter.post(
  "/",
  isAuthenticated,
  validation(placeOrderSchema),
  asyncHandler(placeOrder),
);

orderRouter.get(
  "/",
  isAuthenticated,
  validation(getUserOrdersSchema),
  asyncHandler(getUserOrders),
);

orderRouter.get(
  "/:orderId",
  isAuthenticated,
  validation(orderIdSchema),
  asyncHandler(getSingleOrder),
);

orderRouter.patch(
  "/:orderId/cancel",
  isAuthenticated,
  validation(orderIdSchema),
  asyncHandler(cancelOrder),
);

export default orderRouter;
