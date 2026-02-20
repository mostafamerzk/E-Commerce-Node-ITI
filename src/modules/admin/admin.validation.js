import Joi from "joi";
import {isValidObjectId} from "../../middleware/validation.middleware.js";
import { orderStatus, paymentMethods, paymentStatus } from "../../utils/enums/enums.js";

export const getAllUsersSchema = Joi.object({
    page: Joi.number().optional().min(1),
    limit: Joi.number().optional().min(10).max(30) 
});
export const getByIdSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
})
;

export const getAllProductsSchema = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(10).optional(),
    sort: Joi.string().valid("newest", "oldest", "priceHigh", "priceLow", "rating").optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    rating: Joi.number().valid(1,2,3,4,5).optional(),
    inStock: Joi.string().valid("true", "false").optional(),
    search: Joi.string().min(2).optional(),
});
export const getAllOrdersSchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().min(10).max(30).optional(),
    sort: Joi.string().valid("newest", "oldest", "totalHigh", "totalLow", "status").optional(),
    orderStatus: Joi.string().valid(...Object.values(orderStatus)).optional(),
    userId: Joi.string().custom(isValidObjectId).optional(),
    paymentMethod: Joi.string().valid(...Object.values(paymentMethods)).optional(),
    paymentStatus: Joi.string().valid(...Object.values(paymentStatus)).optional(),
    minTotal: Joi.number().min(0).optional(),
    maxTotal: Joi.number().min(0).optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
});
export const updateOrderStatusSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
    orderStatus: Joi.string().valid(...Object.values(orderStatus)).required()
})
export const getAllBannersSchema = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(10).max(30).optional(),
    sort: Joi.string().valid("newest", "oldest", "title").optional(),
    isActive: Joi.string().valid("true", "false").optional(),
    search: Joi.string().min(2).optional(),
})
export const createBannerSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    link: Joi.string().uri().required(),
})  
export const updateBannerSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
    title: Joi.string().min(2).max(100).optional(),
    link: Joi.string().uri().optional(),
    isActive: Joi.boolean().optional()
}).min(1);
