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

const sellerRouter = express.Router();


sellerRouter.use(isAuthenticated);


sellerRouter.patch(
  "/profile",
  validation(createSellerSchema),
  upsertSellerProfileService
);


sellerRouter.get("/profile", getSellerProfileService);

// ========================================
// GET /seller/products
// جلب منتجات Seller
// ========================================
sellerRouter.get("/products", getSellerProductsService);

// ========================================
// GET /seller/inventory
// نظرة عامة على stock
// ========================================
sellerRouter.get("/inventory", getSellerInventoryService);

export default sellerRouter;