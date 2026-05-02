"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("../controllers/auth");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.default)();
router.post("/signup", rateLimiter_1.authLimiter, auth_1.AuthController.signup);
router.post("/verify-otp", rateLimiter_1.authLimiter, auth_1.AuthController.verifyOtp);
router.post("/resend-otp", rateLimiter_1.authLimiter, auth_1.AuthController.resendOtp);
router.post("/login", rateLimiter_1.authLimiter, auth_1.AuthController.login);
router.post("/forgot-password", rateLimiter_1.authLimiter, auth_1.AuthController.forgotPassword);
router.post("/reset-password", rateLimiter_1.authLimiter, auth_1.AuthController.resetPassword);
router.get("/github", passport_1.default.authenticate("github", {
    scope: ["user:email", "repo", "admin:repo_hook", "workflow"],
    session: false,
}));
router.get("/github/callback", passport_1.default.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/github/callback?error=github_auth_failed`,
}), auth_1.AuthController.githubCallback);
router.post("/refresh", rateLimiter_1.globalLimiter, auth_1.AuthController.refresh);
router.post("/logout", rateLimiter_1.globalLimiter, auth_1.AuthController.logout);
exports.default = router;
