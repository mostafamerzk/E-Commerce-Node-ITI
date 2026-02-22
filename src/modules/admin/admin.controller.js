import express from "express";
import * as adminService from "./admin.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { roles } from "../../utils/enums/enums.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as adminValidation from "./admin.validation.js";
import { uploadCloud, fileValidations } from "../../utils/multer/cloudUpload.js";
export const adminRoutes = express.Router();
//1
adminRoutes.route("/users")
    .get(
        validation(adminValidation.getAllUsersSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getAllUsers));
//2
adminRoutes.route("/users/:id")
    .get(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getUserById))
//3
adminRoutes.route("/users/:id/restrict")
    .patch(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.restrictUser))
//4
adminRoutes.route("/users/:id/approve")
    .patch(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.approveUser))
//5
adminRoutes.route("/products")
    .get(
        validation(adminValidation.getAllProductsSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getAllProducts))
//6
adminRoutes.route("/products/:id")
    .get(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getProductById))
//7
adminRoutes.route("/products/:id")
    .delete(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.deleteProduct))
//8        
adminRoutes.route("/products/:id/recover")
    .patch(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.recoverProduct))
//9
adminRoutes.route("/orders")
    .get(
        validation(adminValidation.getAllOrdersSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getAllOrders))
//10
adminRoutes.route("/orders/:id")
    .get(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getOrderById))
//11
adminRoutes.route("/orders/:id/status")
    .patch(
        validation(adminValidation.updateOrderStatusSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.updateOrderStatus))  
//12
adminRoutes.route("/banners")
    .get(
        validation(adminValidation.getAllBannersSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getAllBanners))
    .post(
        validation(adminValidation.createBannerSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        uploadCloud(fileValidations.Image).single("image"),
        asyncHandler(adminService.createBanner))

adminRoutes.route("/banners/:id")
    .get(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getBannerById))
    .patch(
        validation(adminValidation.updateBannerSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        uploadCloud(fileValidations.Image).single("image"),
        asyncHandler(adminService.updateBanner))
    .delete(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.deActivateBanner))
//16
adminRoutes.route("/banners/:id/activate")
    .patch(
        validation(adminValidation.getByIdSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.activateBanner))

