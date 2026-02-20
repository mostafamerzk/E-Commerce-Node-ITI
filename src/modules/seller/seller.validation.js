import Joi from "joi";

export const createSellerSchema = Joi.object({
  userId: Joi.string()
    .hex()
    .length(24)
    .messages({
      "string.base": "User ID must be a string",
      "string.hex": "User ID must be a valid ObjectId",
      "string.length": "User ID must be 24 characters",
      "any.required": "User ID is required"
    }),

  storeName: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Store name is required",
      "string.min": "Store name must be at least 3 characters",
      "string.max": "Store name must not exceed 50 characters"
    }),

  storeDescription: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(""),

  storeImage: Joi.string()
    .uri()
    .pattern(/\.(png|jpg|jpeg|webp)$/i)
    .optional()
    .messages({
      "string.uri": "Store image must be a valid URL",
      "string.pattern.base": "Store image must be png, jpg, jpeg, or webp"
    }),

  phone: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be in international format e.g. +201XXXXXXXXX"
    })
});