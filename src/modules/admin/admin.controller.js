import express from "express";
import * as adminService from "./admin.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
export const adminRoutes = express.Router();
adminRoutes.route("/users")
    .get(asyncHandler(isAuthenticated),
        isAuthorized("admin"),
        asyncHandler(adminService.getAllUsers));
adminRoutes.route("/users/:id")
    .get(asyncHandler(isAuthenticated),
        isAuthorized("admin"),
        asyncHandler(adminService.getUserById))
adminRoutes.route("/users/email/:email")
    .get(asyncHandler(isAuthenticated),
        isAuthorized("admin"),
        asyncHandler(adminService.getUserbyEmail))
adminRoutes.route("/users/:id/restrict")
    .patch(asyncHandler(isAuthenticated),
        isAuthorized("admin"),
        asyncHandler(adminService.restrictUser))
adminRoutes.route("/users/:id/approve")
    .patch(asyncHandler(isAuthenticated),
        isAuthorized("admin"),
        asyncHandler(adminService.approveUser))
    
adminRoutes.route("/products")
    .get(asyncHandler(isAuthenticated),
        isAuthorized("admin"),
        asyncHandler(adminService.getAllProducts))
adminRoutes.route("/products/:id")
    .get(asyncHandler(isAuthenticated),
        isAuthorized("admin"),
        asyncHandler(adminService.getProductById))
adminRoutes.route("/products/:id")
    .delete(asyncHandler(isAuthenticated),
        isAuthorized("admin"),
        asyncHandler(adminService.deleteProduct))