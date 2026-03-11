import Router from "express";
const userRouter = Router();
import * as userService from "./user.service.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { roles } from "../../utils/enums/enums.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as userSchema from "./user.validation.js";
import { fileValidations } from "../../utils/multer/cloudUpload.js";
import { uploadCloud } from "../../utils/multer/cloudUpload.js";
userRouter
  .route("/profile")
  .get(
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user, roles.admin),
    asyncHandler(userService.profile),
  );
userRouter
  .route("/profile/update")
  .patch(
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(userSchema.updateUser),
    asyncHandler(userService.updateProfile),
  );
userRouter
  .route("/profile/image")
  .post(
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    uploadCloud(fileValidations.Image).single("image"),
    asyncHandler(userService.profileImage),
  );
userRouter
  .route("/profile/changePassword")
  .patch(
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    validation(userSchema.changePassword),
    asyncHandler(userService.changePassword),
  );
userRouter
  .route("/profile/freeze")
  .delete(
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user, roles.admin),
    asyncHandler(userService.freezeAcc),
  );
userRouter
  .route("/profile/sendOtp")
  .get(
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    asyncHandler(userService.sendOtp),
  );
userRouter
  .route("/profile/verifyOtp")
  .post(
    asyncHandler(isAuthenticated),
    isAuthorized(roles.user),
    asyncHandler(userService.verifyOtp),
  );

userRouter
  .route("/log_out")
  .get(asyncHandler(isAuthenticated), asyncHandler(userService.logOut));
export default userRouter;
