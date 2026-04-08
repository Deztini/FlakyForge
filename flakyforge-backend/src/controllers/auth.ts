import { NextFunction, Request, Response } from "express";
import {
  loginSchema,
  otpSchema,
  signupSchema,
  resendOtpSchema,
} from "../validators/auth.schema";
import { AuthService } from "../services/authService";
import { ApiError } from "../utils/ApiError";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { RefreshToken } from "../models/RefreshToken";
import { env } from "../config/env";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000,
};

export const AuthController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const input = signupSchema.parse(req.body);

      const result = await AuthService.signup(input);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = resendOtpSchema.parse(req.body);

      const result = await AuthService.resendOtp(email);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const input = otpSchema.parse(req.body);

      const result = await AuthService.verifyOtp(input);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);

      const result = await AuthService.login(input);

      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      res.cookie("accessToken", result.accessToken, ACCESS_COOKIE_OPTIONS);

      res.status(201).json({
        message: result.message,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  },

  async githubCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as any;

      if (!user) {
        return res.redirect(
          `${env.FRONTEND_URL}/auth/github/callback?error=no_user`,
        );
      }

      const payload = { userId: user._id.toString(), email: user?.email };

      const accessToken = signAccessToken(payload);
      const refreshToken = signRefreshToken(payload);

      await RefreshToken.create({
        token: refreshToken,
        userId: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);

      const frontendUrl = env.FRONTEND_URL;
      res.redirect(
        `${frontendUrl}/auth/github/callback`,
      );
    } catch (error) {
      const frontendUrl = env.FRONTEND_URL;

      res.redirect(
        `${frontendUrl}/auth/github/callback?error=github_auth_failed`,
      );
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) throw ApiError.unauthorized("No refresh token");

      const { accessToken, refreshToken, user } =
        await AuthService.refresh(token);

      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);

      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;

      if (token) await AuthService.logout(token);

      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);

      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  },
};
