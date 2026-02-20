import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  parentCategoryId: Joi.string().custom(isValidObjectId).optional(),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
  }).required(),
}).required();

export const updateCategorySchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId).required(),
  name: Joi.string().min(2).max(50),
  parentCategoryId: Joi.string().custom(isValidObjectId).optional(),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
  }),
}).required();

export const deleteCategorySchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId).required(),
}).required();

export const getCategorySchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId).required(),
}).required();
