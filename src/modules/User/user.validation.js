import joi from "joi";
export const updateUser = joi
  .object({
    userName: joi.string().min(5).max(15).required(),
  })
  .required();

export const changePassword = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi
      .string()
      .min(8)
      .not(joi.ref("oldPassword"))
      .required()
      .messages({
        "any.invalid": "New password must not be the same as old password.",
      }),
    confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();
