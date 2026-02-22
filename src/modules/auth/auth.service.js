import { User } from "../../DB/Models/user.js";
import { providers, roles } from "../../utils/enums/enums.js";
import { activateAcc } from "../../utils/email/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import { Subjects } from "../../utils/email/sendEmail.js";
import { send_otp } from "../../utils/otp/otp.event.js";
import { OTP } from "../../DB/Models/OTP.js";
import { OAuth2Client } from "google-auth-library";

export const register = async (req, res, next) => {
  // ensure that email not exist
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser)
    return next(new Error("Email already in use", { cause: 400 }));
  // create a new user
  await User.create({
    ...req.body,
    passwordChangeTime: Date.now(),
  });

  // send activated email
  activateAcc.emit("activateAcc", req.body.email, Subjects.VerifyEmail);
  return res.status(201).json({ message: "User created successfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // check for email first
  const user = await User.findOne({ email, provider: providers.system });
  if (!user) return next(new Error("Email Not Found!!", { cause: 404 }));

  // check for password
  if (!compareHash(password, user.password))
    return next(new Error("invalid password!!", { cause: 401 }));
  user.isLogged = true;
  await user.save();
  return res.status(200).json({
    success: "true",
    message: "login success",
    access_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
    refresh_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    }),
  });
};

export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const userData = await verify();

  if (!userData.email_verified) return next(new Error("Email is invalid!"));

  let user = await User.findOne({ email: userData.email });
  // console.log(userData.email);

  if (!user)
    user = await User.create({
      email: userData.email,
      userName: userData.name,
      isAcctivated: true,
      provider: providers.google,
    });
  if (user.provider !== providers.google)
    return next(new Error("Invalid Provider!"));

  return res.status(200).json({
    success: "true",
    message: "login success",
    access_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
    refresh_token: generateToken({
      payload: { id: user._id, email: user.email },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    }),
  });
};
export const acctivateAcc = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token });
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 400 }));
  user.isAcctivated = true;
  await user.save();
  return res.status(200).json({ message: "Account activated successfully" });
};

export const forgetPass = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
    isAcctivated: true,
    isDeleted: false,
  });

  if (!user) return next(new Error("user not found!", { cause: 400 }));

  send_otp.emit("resetPass", email, Subjects.ResetPassword);
  return res.status(200).json({ message: "otp sent successfully!!" });
};

export const resetPass = async (req, res, next) => {
  const { otp, password, email } = req.body;
  const user = await User.findOne({
    email,
    isAcctivated: true,
    isDeleted: false,
  });

  if (!user) return next(new Error("user not found!", { cause: 400 }));

  const otpExist = await OTP.findOne({ email });

  if (!compareHash(otp, otpExist.otp)) return next(new Error("invalid otp!!"));

  user.password = password;
  await user.save();
  return res.status(201).json({ message: "try to login now! " });
};

export const newAccess = async (req, res, next) => {
  const { refresh_token } = req.body;
  const decoded = verifyToken({ token: refresh_token });
  if (!decoded)
    return next(new Error("Invalid Refresh Token!!", { cause: 404 }));
  const user = await User.findById(decoded.id);
  console.log(decoded);

  if (!user) return next(new Error("user not found!", { cause: 404 }));

  return res.status(200).json({
    message: "success",
    access_token: generateToken({
      payload: { id: decoded.id, email: decoded.email },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    }),
  });
};
