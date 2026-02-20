import Joi from "joi"
import { isValidObjectId } from "../../middleware/validation.middleware.js"

export const addwishvalidation=Joi.object({
    productId:Joi.string().required().custom(isValidObjectId)
})

export const deletewishvalidation=Joi.object({
    productId:Joi.string().required().custom(isValidObjectId)
})
