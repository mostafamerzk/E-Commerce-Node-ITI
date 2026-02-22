import Joi from "joi";

export const createSellerSchema = Joi.object({
 

  storename: Joi.string()
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

 

  phone: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be in international format e.g. +201XXXXXXXXX"
    })
});