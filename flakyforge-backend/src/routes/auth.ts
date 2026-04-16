import Router from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth";
import { authLimiter, globalLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/signup", authLimiter, AuthController.signup);

router.post("/verify-otp", authLimiter, AuthController.verifyOtp);

router.post("/resend-otp", authLimiter, AuthController.resendOtp);

router.post("/login", authLimiter, AuthController.login);

router.post("/forgot-password", authLimiter, AuthController.forgotPassword);

router.post("/reset-password", authLimiter, AuthController.resetPassword);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email", "repo", "admin:repo_hook", "workflow"],
    session: false,
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/github/callback?error=github_auth_failed`,
  }),
  AuthController.githubCallback,
);

router.post("/refresh", globalLimiter, AuthController.refresh);

router.post("/logout", globalLimiter, AuthController.logout);

export default router;
