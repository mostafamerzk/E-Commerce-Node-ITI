import joi from "joi";
export const updateUser = joi
  .object({
    userName: joi.string().min(5).max(15),
    phone: joi.string(),
    addressId: joi.string().hex().length(24),
    address: joi.object({
      street: joi.string().trim(),
      city: joi.string().trim(),
      country: joi.string().trim(),
      postalCode: joi.string().trim(),
      phone: joi.string(),
    }),
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
