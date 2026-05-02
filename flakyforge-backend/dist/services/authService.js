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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Otp_1 = require("../models/Otp");
const RefreshToken_1 = require("../models/RefreshToken");
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const generateOtp_1 = require("../utils/generateOtp");
const jwt_1 = require("../utils/jwt");
const sendOtpEmail_1 = require("../utils/sendOtpEmail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const REFRESH_EXPIRY = 7 * 24 * 60 * 60 * 1000;
exports.AuthService = {
    signup(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield User_1.User.findOne({ email: input.email });
            if (existingUser) {
                throw ApiError_1.ApiError.badRequest("Something went wrong");
            }
            const hashedPassword = yield bcrypt_1.default.hash(input.password, 12);
            const user = yield User_1.User.create({
                email: input.email,
                password: hashedPassword,
                fullName: input.fullName,
                role: input.role || "Developer",
            });
            const otp = (0, generateOtp_1.generateOtp)();
            yield Otp_1.Otp.create({
                email: input.email,
                code: otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                purpose: "verify",
            });
            yield (0, sendOtpEmail_1.sendOtpEmail)(input.email, otp);
            return {
                email: user.email,
            };
        });
    },
    resendOtp(email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email });
            if (!user) {
                throw ApiError_1.ApiError.notFound("No account found with this email");
            }
            const otp = (0, generateOtp_1.generateOtp)();
            yield Otp_1.Otp.deleteMany({ email });
            yield Otp_1.Otp.create({
                email,
                code: otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                purpose,
            });
            yield (0, sendOtpEmail_1.sendOtpEmail)(email, otp);
            return {
                message: purpose === "verify"
                    ? "A new verification code has been sent to your email."
                    : "A new password reset code has been sent to your email.",
            };
        });
    },
    verifyOtp(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpRecord = yield Otp_1.Otp.findOne({
                email: input.email,
                code: input.code,
            });
            if (!otpRecord) {
                throw ApiError_1.ApiError.badRequest("Invalid or expired verification code");
            }
            if (otpRecord.expiresAt < new Date()) {
                yield Otp_1.Otp.deleteOne({ email: input.email });
                throw ApiError_1.ApiError.badRequest("Verification code has expired");
            }
            if (otpRecord.code !== input.code) {
                throw ApiError_1.ApiError.badRequest("Incorrect verification code");
            }
            const user = yield User_1.User.findOne({ email: input.email });
            if (!user) {
                throw ApiError_1.ApiError.notFound("User not found");
            }
            if (otpRecord.purpose === "verify") {
                yield User_1.User.updateOne({ email: input.email }, { $set: { isVerified: true } });
                yield Otp_1.Otp.deleteOne({ email: input.email });
                return {
                    message: "Email verification successful",
                };
            }
            if (otpRecord.purpose === "reset") {
                const resetToken = (0, jwt_1.signAccessToken)({
                    userId: user._id.toString(),
                    email: user.email,
                });
                yield Otp_1.Otp.deleteOne({ email: input.email });
                return {
                    message: "OTP verified",
                    resetToken,
                };
            }
        });
    },
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email: input.email });
            if (!user) {
                throw ApiError_1.ApiError.unauthorized("Invalid credentials");
            }
            const passwordMatch = yield bcrypt_1.default.compare(input.password, user.password);
            if (!passwordMatch) {
                throw ApiError_1.ApiError.unauthorized("Invalid credentials");
            }
            if (!user.isVerified) {
                throw ApiError_1.ApiError.unauthorized("Verify your email before logging in");
            }
            const payload = { userId: user._id.toString(), email: user.email };
            const accessToken = (0, jwt_1.signAccessToken)(payload);
            const refreshToken = (0, jwt_1.signRefreshToken)(payload);
            yield RefreshToken_1.RefreshToken.create({
                token: refreshToken,
                userId: user._id,
                expiresAt: new Date(Date.now() + REFRESH_EXPIRY),
            });
            return {
                accessToken,
                refreshToken,
                message: "Login successful",
                user: {
                    id: user._id.toString(),
                    name: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            };
        });
    },
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email });
            if (!user) {
                throw ApiError_1.ApiError.notFound("No account found with this email");
            }
            const otp = (0, generateOtp_1.generateOtp)();
            yield Otp_1.Otp.deleteMany({ email });
            yield Otp_1.Otp.create({
                email,
                code: otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                purpose: "reset",
            });
            yield (0, sendOtpEmail_1.sendOtpEmail)(email, otp);
            return {
                message: "A verification code has been sent to your email.",
            };
        });
    },
    resetPassword(userId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findById({ _id: userId });
            if (!user) {
                throw ApiError_1.ApiError.notFound("User not found");
            }
            const hashedPassword = yield bcrypt_1.default.hash(input.newPassword, 12);
            user.password = hashedPassword;
            yield user.save();
            yield RefreshToken_1.RefreshToken.deleteMany({ userId: user._id });
            return {
                message: "Password reset successful",
            };
        });
    },
    refresh(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = (0, jwt_1.verifyRefreshToken)(token);
            const refreshedUser = yield User_1.User.findOne({ email: decoded.email });
            if (!refreshedUser) {
                throw ApiError_1.ApiError.unauthorized("User not found");
            }
            const storedRefreshToken = yield RefreshToken_1.RefreshToken.findOne({ token });
            if (!storedRefreshToken) {
                throw ApiError_1.ApiError.unauthorized("Invalid refresh token");
            }
            yield RefreshToken_1.RefreshToken.deleteOne({ token });
            const payload = {
                userId: decoded.userId,
                email: decoded.email,
            };
            const newAccessToken = (0, jwt_1.signAccessToken)(payload);
            const newRefreshToken = (0, jwt_1.signRefreshToken)(payload);
            yield RefreshToken_1.RefreshToken.create({
                token: newRefreshToken,
                userId: payload.userId,
                expiresAt: new Date(Date.now() + REFRESH_EXPIRY),
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                user: {
                    id: refreshedUser._id.toString(),
                    name: refreshedUser.fullName,
                    email: refreshedUser.email,
                    role: refreshedUser.role,
                },
            };
        });
    },
    logout(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield RefreshToken_1.RefreshToken.deleteOne({ token });
        });
    },
};
