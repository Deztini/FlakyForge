import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.string().optional(),
});

export const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof otpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
