import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";
import { paymentMethods } from "../../utils/enums/enums.js";

export const checkoutSummarySchema = Joi.object({
  couponCode: Joi.string().trim(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string(),
    phone: Joi.string().required(),
  }).optional(),
}).required();

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
  couponCode: Joi.string().trim(),
}).required();

export const orderIdSchema = Joi.object({
  orderId: Joi.string().custom(isValidObjectId).required(),
}).required();
