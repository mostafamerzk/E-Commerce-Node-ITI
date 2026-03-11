import { OTP } from "../../DB/Models/OTP.js";
import { User } from "../../DB/Models/user.js";
import { activateAcc } from "../../utils/email/email.event.js";
import { Subjects } from "../../utils/email/sendEmail.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import { cloud } from "../../utils/multer/cloud.config.js";
import { send_otp } from "../../utils/otp/otp.event.js";
import { verifyToken } from "../../utils/token/token.js";

export const profile = async (req, res, next) => {
  // return user data
  return res.status(200).json({
    result: "success",
    data: { ...req.user },
  });
};

export const profileImage = async (req, res, next) => {
  const folderPath = `${process.env.CLOUD_NAME}/user/${req.user._id}/profile`;
  const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
    folder: folderPath,
  });
  await User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      profilePicture: {
        secure_url,
        public_id,
      },
    },
  );
  return res.status(200).json({ message: "success", file: req.file });
};

export const updateProfile = async (req, res, next) => {
  //date
  const { userName } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { userName },
    {
      runValidators: true,
      returnDocument: "after",
    },
  );
  return res.status(201).json({
    success: "true",
    message: "updated successfully",
  });
};
export const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById({ _id: req.user._id });

  if (!compareHash(oldPassword, user.password))
    return next(new Error("Old Password Is Incorrect", { cause: 409 }));

  user.password = newPassword;
  user.passwordChangeTime = Date.now();
  await user.save();
  return res
    .status(201)
    .json({ result: "success", message: "password changed successfully" });
};

export const freezeAcc = async (req, res, next) => {
  await User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      isDeleted: true,
    },
  );
  return res
    .status(201)
    .json({ result: "success", message: "freezed successfully" });
};

export const sendOtp = async (req, res, next) => {
  const sendedOtp = send_otp.emit("reActivateAcc", req.user.email);

  if (!sendedOtp)
    return next(
      new Error("there is something wrong with sending otp process!!", {
        cause: 400,
      }),
    );

  return res.status(200).json({ message: "otp send successfully" });
};
export const verifyOtp = async (req, res, next) => {
  const { otp } = req.body;
  const hashedOtp = await OTP.findOne({ email: req.user.email });

  if (!compareHash(otp, hashedOtp.otp))
    return next(new (Error("invalid OTP", { cause: 400 }))());

  await User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    {
      isDeleted: false,
      passwordChangeTime: Date.now(),
    },
    {
      runValidators: true,
    },
  );
  return res
    .status(200)
    .json({ message: "Activated success , back to work !!" });
};

export const logOut = async (req, res, next) => {
  const user = await User.findById({ email: req.user.email });
  user.tokens = user.tokens.filter((token) => token.token !== req.token);
  await user.save();
  return res.status(200).json({ message: "logged out successfully!!" });
};
