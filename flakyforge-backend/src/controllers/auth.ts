import { NextFunction, Request, Response } from "express";
import {
  loginSchema,
  otpSchema,
  signupSchema,
  resendOtpSchema
} from "../validators/auth.schema";
import { AuthService } from "../services/authService";
import { ApiError } from "../utils/ApiError";
import { signAccessToken } from "../utils/jwt";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
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

      res
        .status(200)
        .json({
          message: result.message,
          accessToken: result.accessToken,
          user: result.user,
        });
    } catch (error) {
      next(error);
    }
  },

   async githubCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      const payload = {userId: user._id.toString(), email: user?.email}

      const token = signAccessToken(payload);

      res
        .status(200)
        .json({
          success: true,
          token,
          user
        });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) throw ApiError.unauthorized('No refresh token');

      const { accessToken, refreshToken } = await AuthService.refresh(token);

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

      res.status(200).json({ accessToken });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;

      if (token) await AuthService.logout(token);

      res.clearCookie('refreshToken', COOKIE_OPTIONS);

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  },
};
