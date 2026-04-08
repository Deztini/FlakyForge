import { Otp } from "../models/Otp";
import { RefreshToken } from "../models/RefreshToken";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { generateOtp } from "../utils/generateOtp";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { sendOtpEmail } from "../utils/sendOtpEmail";
import {
  LoginInput,
  SignupInput,
  VerifyOtpInput,
} from "../validators/auth.schema";
import bcrypt from "bcrypt";

const REFRESH_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const AuthService = {
  async signup(input: SignupInput) {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw ApiError.badRequest("Account already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await User.create({
      email: input.email,
      password: hashedPassword,
      fullName: input.fullName,
      role: input.role || "Developer",
    });

    const otp = generateOtp();

    await Otp.deleteMany({ email: input.email });

    await Otp.create({
      email: input.email,
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(input.email, otp);

    return {
      message:
        "Account created. Please check email for the 6 digit verification code",
      email: user.email,
    };
  },

  async resendOtp(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.notFound("No account found with this email");
    }

    if (user.isVerified) {
      throw ApiError.badRequest("This account is already verified");
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(email, otp);

    return {
      message: "A new verification code has been sent to your email.",
    };
  },

  async verifyOtp(input: VerifyOtpInput) {
    const otpRecord = await Otp.findOne({
      email: input.email,
      code: input.code,
    });

    if (!otpRecord) {
      throw ApiError.badRequest("Invalid or expired verification code");
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email: input.email });
      throw ApiError.badRequest("Verification code has expired");
    }

    if (otpRecord.code !== input.code) {
      throw ApiError.badRequest("Incorrect verification code");
    }

    await User.updateOne(
      { email: input.email },
      { $set: { isVerified: true } },
    );

    await Otp.deleteOne({ email: input.email });

    return {
      message: "Email verification successful",
    };
  },

  async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);

    if (!passwordMatch) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    if (!user.isVerified) {
      throw ApiError.unauthorized("Verify your email before logging in");
    }

    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await RefreshToken.create({
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
  },

   async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.notFound("No account found with this email");
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(email, otp);

    return {
      message: "A verification code has been sent to your email.",
    };
  },

  async refresh(token: string) {
    const decoded = verifyRefreshToken(token);

    const refreshedUser = await User.findOne({ email: decoded.email });

    if (!refreshedUser) {
      throw ApiError.unauthorized("User not found");
    }

    const storedRefreshToken = await RefreshToken.findOne({ token });

    if (!storedRefreshToken) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    await RefreshToken.deleteOne({ token });

    const payload = {
      userId: decoded.userId,
      email: decoded.email,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    await RefreshToken.create({
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
  },

  async logout(token: string) {
    await RefreshToken.deleteOne({ token });
  },
};
