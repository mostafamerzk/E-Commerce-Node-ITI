import express from "express";
import * as adminService from "./admin.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { roles } from "../../utils/enums/enums.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as adminValidation from "./admin.validation.js";
export const adminRoutes = express.Router();
//1
adminRoutes.route("/users")
    .get(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getAllUsers));
//2
adminRoutes.route("/users/:id")
    .get(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getUserById))
//3
adminRoutes.route("/users/:id/restrict")
    .patch(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.restrictUser))
//4
adminRoutes.route("/users/:id/approve")
    .patch(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.approveUser))
//5
adminRoutes.route("/products")
    .get(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getAllProducts))
//6
adminRoutes.route("/products/:id")
    .get(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.getProductById))
//7
adminRoutes.route("/products/:id")
    .delete(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.deleteProduct))
//8        
adminRoutes.route("/products/:id/recover")
    .patch(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.recoverProduct))
//9
adminRoutes.route("/orders")
    .get(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getAllOrders))
//10
adminRoutes.route("/orders/:id")
    .get(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.getOrderById))
//11
adminRoutes.route("/orders/:id/status")
    .patch(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.updateOrderStatus))  
//12
adminRoutes.route("/banners")
    .get(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.getAllBanners))
//13
adminRoutes.route("/banners/:id")
    .get(asyncHandler(isAuthenticated),
    isAuthorized(roles.admin),
    asyncHandler(adminService.getBannerById)
)
//14
adminRoutes.route("/banners")
    .post(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        asyncHandler(adminService.createBanner))
//15
adminRoutes.route("/banners/:id")
    .delete(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.deleteBanner))
//16
adminRoutes.route("/banners/:id/recover")
    .patch(asyncHandler(isAuthenticated),
        isAuthorized(roles.admin),
        validation(adminValidation.getByIdSchema),
        asyncHandler(adminService.recoverBanner))

