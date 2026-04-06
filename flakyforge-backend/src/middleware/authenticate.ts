import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "../models/User";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw ApiError.unauthorized("No token provided");
    }

    const payload = verifyAccessToken(token) as {
      userId: string;
      email: string;
    };

    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : ApiError.unauthorized("Invalid or expired token"),
    );
  }
}