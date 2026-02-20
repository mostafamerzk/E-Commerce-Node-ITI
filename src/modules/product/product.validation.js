import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";


export const createProductSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(200)
    .required(),

  description: Joi.string()
    .max(2000)
    .allow(""),

  price: Joi.number()
    .min(0)
    .required(),

  discount: Joi.number()
    .min(0)
    .max(100)
    .default(0),

  stock: Joi.number()
    .min(0)
    .required(),

  categoryId: Joi.string()
    .required()
    .custom(isValidObjectId)
});


export const getProductsQuerySchema = Joi.object({
  search: Joi.string().allow(""),

  minPrice: Joi.number().min(0),

  maxPrice: Joi.number().min(0),

  categoryId: Joi.string().custom(isValidObjectId),

  sort: Joi.string(),

  page: Joi.number().min(1).default(1),

  limit: Joi.number().min(1).max(100).default(10)
});


export const updateProductSchema = Joi.object({
  title: Joi.string().min(2).max(200),
  description: Joi.string().max(2000).allow(""),
  price: Joi.number().min(0),
  discount: Joi.number().min(0).max(100),
  stock: Joi.number().min(0),
  categoryId: Joi.string().custom(isValidObjectId)
});
