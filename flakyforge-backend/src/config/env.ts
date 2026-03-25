import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI!,
  NODE_ENV: process.env.NODE_ENV,

  MAILTRAP_TOKEN:    process.env.MAILTRAP_TOKEN!,
  MAILTRAP_INBOX_ID: Number(process.env.MAILTRAP_INBOX_ID),

  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!
}