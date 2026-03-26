import Router from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth";

const router = Router();

router.post("/signup", AuthController.signup);

router.post("/verify-otp", AuthController.verifyOtp);

router.post("/resend-otp", AuthController.resendOtp);

router.post("/login", AuthController.login);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  AuthController.githubCallback
);

router.post("/refresh", AuthController.refresh);

router.post("/logout", AuthController.logout);

export default router;
