import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const addReviewSchema = Joi.object({
    productId: Joi.string().custom(isValidObjectId).required(), // product id from route param
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().optional().max(1000),
});

export const updateReviewSchema = Joi.object({
    reviewId: Joi.string().custom(isValidObjectId).required(), // review id from route param
    rating: Joi.number().min(1).max(5).optional(),
    comment: Joi.string().optional().max(1000)

});
export const getReviewSchema = Joi.object({
    productId: Joi.string().custom(isValidObjectId).required(), // product id from route param
    sort: Joi.string().valid("newest", "oldest", "ratingHigh", "ratingLow","").optional(),
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(10).max(30).optional(),
    minRating: Joi.number().integer().optional().valid(1,2,3,4,5),
    maxRating: Joi.number().integer().optional().valid(1,2,3,4,5),
    rating: Joi.number().integer().optional().valid(1,2,3,4,5),
});
export const deleteReviewSchema = Joi.object({
    reviewId: Joi.string().custom(isValidObjectId).required(), // review id from route param
});