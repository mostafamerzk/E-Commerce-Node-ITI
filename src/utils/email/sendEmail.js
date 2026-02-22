import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, content) => {
  try {
    const { html, text } = content;
    const info = await transporter.sendMail({
      from: `"node-iti-intake46.Org "<${process.env.EMAIL}>`,
      to: to,
      subject,
      ...(html ? { html } : { text }),
    });
  } catch (error) {
    console.error(error);
  }
};
export const Subjects = {
  ForgotPassword: "forgot-password",
  ResetPassword: "reset-password",
  VerifyEmail: "verify-email",
  AccountUpdate: "account-update",
  Activated: " Account Activated successfully !",
};
export default sendEmail;
