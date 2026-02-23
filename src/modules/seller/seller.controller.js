import express from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js"; // Auth middleware
import { validation } from "../../middleware/validation.middleware.js";  // Joi validation
import {
  upsertSellerProfileService,
  getSellerProfileService,
  getSellerProductsService,
  getSellerInventoryService
} from "./seller.service.js";
import { createSellerSchema } from "./seller.validation.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";

const sellerRouter = express.Router();


sellerRouter.use(isAuthenticated);


sellerRouter.patch(
  "/profile",
  validation(createSellerSchema),
  asyncHandler(upsertSellerProfileService)
);


sellerRouter.get("/profile", asyncHandler(getSellerProfileService));


sellerRouter.get("/products", asyncHandler(getSellerProductsService));


sellerRouter.get("/inventory", asyncHandler(getSellerInventoryService));

export default sellerRouter;