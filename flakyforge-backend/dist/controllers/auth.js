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
exports.AuthController = void 0;
const auth_schema_1 = require("../validators/auth.schema");
const authService_1 = require("../services/authService");
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const RefreshToken_1 = require("../models/RefreshToken");
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const jwt_2 = require("../utils/jwt");
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
const ACCESS_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
};
exports.AuthController = {
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = auth_schema_1.signupSchema.parse(req.body);
                const result = yield authService_1.AuthService.signup(input);
                res.status(201).json({
                    success: true,
                    message: "Account created. Please check email for the 6 digit verification code",
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = auth_schema_1.resendOtpSchema.parse(req.body);
                const user = yield User_1.User.findOne({ email });
                if (!user) {
                    throw ApiError_1.ApiError.notFound("No account found with this email");
                }
                let purpose;
                if (!user.isVerified) {
                    purpose = "verify";
                }
                else {
                    purpose = "reset";
                }
                const result = yield authService_1.AuthService.resendOtp(email, purpose);
                res.status(201).json({ sucess: true, message: `${result.message}` });
            }
            catch (err) {
                next(err);
            }
        });
    },
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = auth_schema_1.otpSchema.parse(req.body);
                const result = yield authService_1.AuthService.verifyOtp(input);
                if (result === null || result === void 0 ? void 0 : result.resetToken) {
                    res.cookie("resetToken", result === null || result === void 0 ? void 0 : result.resetToken, ACCESS_COOKIE_OPTIONS);
                }
                res.status(201).json({ success: true, message: result === null || result === void 0 ? void 0 : result.message });
            }
            catch (error) {
                next(error);
            }
        });
    },
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = auth_schema_1.resendOtpSchema.parse(req.body);
                const result = yield authService_1.AuthService.forgotPassword(input.email);
                res.status(201).json({ success: true, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    },
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.resetToken;
                if (!token) {
                    throw ApiError_1.ApiError.unauthorized("Reset session expired");
                }
                const decoded = (0, jwt_2.verifyAccessToken)(token);
                const input = auth_schema_1.resetPasswordSchema.parse(req.body);
                const result = yield authService_1.AuthService.resetPassword(decoded.userId, input);
                res.clearCookie("resetToken");
                res.status(201).json({ success: true, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    },
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = auth_schema_1.loginSchema.parse(req.body);
                const result = yield authService_1.AuthService.login(input);
                res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
                res.cookie("accessToken", result.accessToken, ACCESS_COOKIE_OPTIONS);
                res.status(201).json({
                    success: true,
                    message: result.message,
                    data: result.user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    },
    githubCallback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    return res.redirect(`${env_1.env.FRONTEND_URL}/auth/github/callback?error=no_user`);
                }
                const payload = { userId: user._id.toString(), email: user === null || user === void 0 ? void 0 : user.email };
                const accessToken = (0, jwt_1.signAccessToken)(payload);
                const refreshToken = (0, jwt_1.signRefreshToken)(payload);
                yield RefreshToken_1.RefreshToken.create({
                    token: refreshToken,
                    userId: user._id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                });
                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
                const frontendUrl = env_1.env.FRONTEND_URL;
                res.redirect(`${frontendUrl}/auth/github/callback`);
            }
            catch (error) {
                const frontendUrl = env_1.env.FRONTEND_URL;
                res.redirect(`${frontendUrl}/auth/github/callback?error=github_auth_failed`);
            }
        });
    },
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (!token)
                    throw ApiError_1.ApiError.unauthorized("No refresh token");
                const { accessToken, refreshToken, user } = yield authService_1.AuthService.refresh(token);
                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
                res.status(200).json({ success: true, message: "Refresh successful", data: user });
            }
            catch (err) {
                next(err);
            }
        });
    },
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
                if (token)
                    yield authService_1.AuthService.logout(token);
                res.clearCookie("refreshToken", COOKIE_OPTIONS);
                res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
                res.status(200).json({ success: true, message: "Logged out successfully" });
            }
            catch (err) {
                next(err);
            }
        });
    },
};
