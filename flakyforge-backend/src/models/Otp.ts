import mongoose, { Document, Schema } from "mongoose";

export interface IOtp extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  purpose: "verify" | "reset"
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  purpose: { type: String, required: true },
});

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model<IOtp>("Otp", OtpSchema);
