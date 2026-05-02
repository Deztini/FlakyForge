"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
// import { mailTrapClient } from "../config/mailer";
const env_1 = require("../config/env");
const mailer_1 = require("../config/mailer");
function sendOtpEmail(to, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield mailer_1.transporter.sendMail({
            from: `"FlakeyRadar" <${env_1.env.GMAIL_USER}>`,
            to,
            subject: 'Your FlakeyRadar verification code',
            text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
            html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6C63FF;">Verify your FlakeyRadar account</h2>
        <p>Enter this code to complete your signup:</p>
        <div style="
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          background: #f4f4f8;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          margin: 24px 0;
        ">
          ${otp}
        </div>
        <p style="color: #666;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #666;">If you didn't create a FlakeyRadar account, ignore this email.</p>
      </div>
    `,
        });
        console.log("sent", result);
    });
}
