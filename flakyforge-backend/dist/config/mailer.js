"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("./env");
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: env_1.env.GMAIL_USER,
        pass: env_1.env.GMAIL_PASS,
    },
});
// import { MailtrapClient } from "mailtrap";
// export const mailTrapClient = new MailtrapClient({
//   token: env.MAILTRAP_TOKEN,
// sandbox: false,
// testInboxId: env.MAILTRAP_INBOX_ID,
// });
