import { EventEmitter } from "events";
import sendEmail, { Subjects } from "./sendEmail.js";
import { html } from "./generateHTML.js";
import { generateToken } from "../token/token.js";

export const activateAcc = new EventEmitter();

activateAcc.on("activateAcc", async (email, subject) => {
  const token = generateToken({ payload: { email } });
  const link = `http://localhost:3000/auth/acctivate_account/${token}`;
  await sendEmail(email, subject, { html: html(link) });
});

activateAcc.on("verifyUpdatedEmail", async (email, id, subject) => {
  const token = generateToken({ payload: { email, id } });
  const link = `http://localhost:3000/user/verifyUpdatedEmail/${token}`;
  await sendEmail(email, subject, { html: html(link) });
});
