import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createCheckoutSession = Joi.object({
  orderId: Joi.string().custom(isValidObjectId).required(),
});
