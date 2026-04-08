import Router from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth";

const router = Router();

router.post("/signup", AuthController.signup);

router.post("/verify-otp", AuthController.verifyOtp);

router.post("/resend-otp", AuthController.resendOtp);

router.post("/login", AuthController.login);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);

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

router.post("/refresh", AuthController.refresh);

router.post("/logout", AuthController.logout);

export default router;
