import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} from "./product.service.js";
import {
  createProductSchema,
  getProductsQuerySchema,
  updateProductSchema
} from "./product.validation.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { roles } from "../../utils/enums/enums.js";
import { uploadCloud } from "../../middleware/multer/cloudUpload.js";
import { fileValidations } from "../../utils/multer/cloudUpload.js";

export const productRouter = new Router();

const uploadProductImages = uploadCloud(fileValidations.Image).fields([
  { name: "mainImage", maxCount: 1 },
  { name: "subImages", maxCount: 5 }
]);

productRouter.post(
  "/",
  isAuthenticated,
  isAuthorized(roles.admin, roles.seller),
  validation(createProductSchema),
  uploadProductImages,
  asyncHandler(createProduct)
);

productRouter.get(
  "/",
  validation(getProductsQuerySchema, "query"),
  asyncHandler(getAllProducts)
);

productRouter.get(
  "/:productId",
  asyncHandler(getSingleProduct)
);

productRouter.patch(
  "/:productId",
  isAuthenticated,
  isAuthorized(roles.admin, roles.seller),
  validation(updateProductSchema),
  uploadProductImages,
  asyncHandler(updateProduct)
);

productRouter.delete(
  "/:productId",
  isAuthenticated,
  isAuthorized(roles.admin, roles.seller),
  asyncHandler(deleteProduct)
);
