"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.resendOtpSchema = exports.loginSchema = exports.otpSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
const strongPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;
exports.signupSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(strongPassword, "Password must contain at least one letter, number, and special character"),
    role: zod_1.z.string().optional(),
});
exports.otpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    code: zod_1.z.string().length(6, "OTP must be exactly 6 digits"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.resendOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
exports.resetPasswordSchema = zod_1.z
    .object({
    newPassword: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(strongPassword, "Password must contain at least one letter, number, and special character"),
    confirmNewPassword: zod_1.z.string().min(1, "Please confirm your password"),
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
});
