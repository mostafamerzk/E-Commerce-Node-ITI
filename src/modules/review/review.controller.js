import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import * as reviewService from "./review.services.js";
import { roles } from "../../utils/enums/enums.js";
import express from "express";
import { validation } from "../../middleware/validation.middleware.js";
import *as reviewSchema from "./review.validation.js";
const reviewRoutes = express.Router();
reviewRoutes.route('/:productId')
    .post(
        validation(reviewSchema.addReviewSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.user,roles.seller,roles.admin),
        asyncHandler(reviewService.addReview));

reviewRoutes.route('/:productId')
    .get(
        validation(reviewSchema.getReviewSchema),
        asyncHandler(reviewService.getProductReviews));

reviewRoutes.route('/:reviewId')
    .patch(
        validation(reviewSchema.updateReviewSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.user,roles.seller,roles.admin),
        asyncHandler(reviewService.updateReview));

reviewRoutes.route('/:reviewId')
    .delete(
        validation(reviewSchema.deleteReviewSchema),
        asyncHandler(isAuthenticated),
        isAuthorized(roles.user,roles.seller,roles.admin),
        asyncHandler(reviewService.deleteReview));
export default reviewRoutes;