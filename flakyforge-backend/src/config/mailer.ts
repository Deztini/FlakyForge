
import nodemailer from "nodemailer";
import { env } from "./env";


export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_PASS,
  },
});



// import { MailtrapClient } from "mailtrap";
// export const mailTrapClient = new MailtrapClient({
//   token: env.MAILTRAP_TOKEN,
  // sandbox: false,
  // testInboxId: env.MAILTRAP_INBOX_ID,
// });
