import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const addCartItemSchema = Joi.object({
    productId: Joi.string()
        .required()
        .custom(isValidObjectId)
        .messages({
            "any.required": "ProductId is required",
            "string.empty": "ProductId cannot be empty"
        }),

    quantity: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Quantity must be a number",
            "number.min": "Quantity must be at least 1"
        })
});

export const updateCartItemSchema = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "Quantity must be a number",
            "number.min": "Quantity must be positive",
            "any.required": "Quantity is required"
        })
});
