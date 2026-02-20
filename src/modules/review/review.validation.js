import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const addReviewSchema = Joi.object({
    productId: Joi.string().custom(isValidObjectId).required(), // product id from route param
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional().max(1000),
});

export const updateReviewSchema = Joi.object({
    reviewId: Joi.string().custom(isValidObjectId).optional(), // review id from route param
    rating: Joi.number().min(1).max(5).optional(),
    comment: Joi.string().optional().max(1000),
});
export const getReviewSchema = Joi.object({
    productId: Joi.string().custom(isValidObjectId).required(), // product id from route param
});
export const deleteReviewSchema = Joi.object({
    reviewId: Joi.string().custom(isValidObjectId).required(), // review id from route param
});