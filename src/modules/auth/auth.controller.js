import { Router } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as authSchemas from "../auth/auth.validation.js";

const authRouter = Router();

authRouter
  .route("/register")
  // .post(authService.login)
  .post(validation(authSchemas.register), asyncHandler(authService.register));
authRouter
  .route("/login")
  .post(validation(authSchemas.login), asyncHandler(authService.login));
// authRouter
//     .route('/loginWithGmail')
//     .post(asyncHandler(authService.loginWithGmail))
authRouter
  .route("/acctivate_account/:token")
  .get(asyncHandler(authService.acctivateAcc));
authRouter
  .route("/forgetPass")
  .post(
    validation(authSchemas.forgetPass),
    asyncHandler(authService.forgetPass),
  );
authRouter
  .route("/resetPass")
  .post(validation(authSchemas.resetPass), asyncHandler(authService.resetPass));

authRouter
  .route("/new_access_token")
  .post(validation(authSchemas.newAccess), authService.newAccess);

export default authRouter;
