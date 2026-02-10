import joi from 'joi';

// register schema
export const register = joi.object({
    userName:joi.string().min(5).max(15).required().trim(),
    email:joi.string().email().required().lowercase(),
    password: joi.string().min(8).required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required(),
}).required();

// login schema
export const login = joi.object({
    email:joi.string().email().required().lowercase(),
    password: joi.string().min(8).required()
}).required(); 
// forget password schema
export const forgetPass = joi.object({
    email:joi.string().email().required().lowercase(),
}).required();
// reset password schema
export const resetPass = joi.object({
    otp:joi.string().required(),
    email:joi.string().email().required().lowercase(),
    password:joi.string().min(8).required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required(),
}).required();

// new access token schema

export const newAccess = joi.object({
    refresh_token: joi.string().required()
}).required();