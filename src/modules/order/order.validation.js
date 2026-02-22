import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";
import { paymentMethods } from "../../utils/enums/enums.js";

export const checkoutSummarySchema = Joi.object({
  couponCode: Joi.string().trim().optional(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string(),
    phone: Joi.string().required(),
  }).optional(),
}).optional();

export const placeOrderSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid(...Object.values(paymentMethods))
    .required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string(),
    phone: Joi.string().required(),
  }).required(),
  couponCode: Joi.string().trim().optional(),
}).required();

export const getUserOrdersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
}).optional();

export const orderIdSchema = Joi.object({
  orderId: Joi.string().custom(isValidObjectId).required(),
}).required();
