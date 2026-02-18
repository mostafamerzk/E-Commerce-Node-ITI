import Joi from "joi";
export const createAdminSchema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin").required()
});
export const updateAdminSchema = Joi.object({
    userName: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    role: Joi.string().valid("admin")
}).min(1);
export const getByIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
});
