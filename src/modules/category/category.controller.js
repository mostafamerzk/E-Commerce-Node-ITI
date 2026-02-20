import { Router } from "express";
import * as categoryService from "./category.service.js";
import * as categoryValidation from "./category.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import {
  uploadCloud,
  fileValidations,
} from "../../utils/multer/cloudUpload.js";
import { roles } from "../../utils/enums/enums.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAuthorized(roles.admin),
  uploadCloud(fileValidations.Image).single("image"),
  validation(categoryValidation.createCategorySchema),
  categoryService.createCategory,
);

router.get("/", categoryService.getCategories);

router.get(
  "/:categoryId",
  validation(categoryValidation.getCategorySchema),
  categoryService.getCategory,
);

router.patch(
  "/:categoryId",
  isAuthenticated,
  isAuthorized(roles.admin),
  uploadCloud(fileValidations.Image).single("image"),
  validation(categoryValidation.updateCategorySchema),
  categoryService.updateCategory,
);

router.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthorized(roles.admin),
  validation(categoryValidation.deleteCategorySchema),
  categoryService.deleteCategory,
);

export default router;
