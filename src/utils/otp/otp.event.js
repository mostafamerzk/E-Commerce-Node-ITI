import { EventEmitter } from "events";
import { generateOtp } from "../otp/generateOtp.js";
import sendEmail, { Subjects } from "./../email/sendEmail.js";
import { asyncHandler } from "../error handling/asyncHandler.js";
import { OTP } from "../../DB/Models/OTP.js";
import { hash } from "../hashing/hash.js";

export const send_otp = new EventEmitter();
send_otp.on("reActivateAcc",asyncHandler(async (email,subject) => {
    const otp = generateOtp()
    const text =`your reActivation otp is: ${otp}`
    await OTP.create({
      email,
      otp:hash({plainText:otp})
    });

    await sendEmail(email,subject,{text})

}));

send_otp.on("resetPass",asyncHandler(async (email,subject) => {
  console.log(email);
  
    const otp = generateOtp()
    const text =`your reset Password otp is: ${otp}`
    await OTP.create({
      email,
      otp:hash({plainText:otp})
    });

    await sendEmail(email,subject,{text})

}));

