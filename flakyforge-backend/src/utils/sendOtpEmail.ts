// import { mailTrapClient } from "../config/mailer";
import { env } from "../config/env";
import { transporter } from "../config/mailer";

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const result = await transporter.sendMail({
    from:   `"FlakeyRadar" <${env.GMAIL_USER}>`,
    to,
    subject: 'Your FlakeyRadar verification code',
    text:    `Your verification code is: ${otp}. It expires in 10 minutes.`,
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
}