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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.userId).select("-password");

    if (!user) throw ApiError.unauthorized("User not found");

    req.user = user;

    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
