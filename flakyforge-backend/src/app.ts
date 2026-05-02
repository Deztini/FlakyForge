import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/github";
import router from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";
import { globalLimiter } from "./middleware/rateLimiter";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.VERCEL_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(globalLimiter);

app.use(cookieParser());

app.use(passport.initialize());

app.use("/api", router);

app.use(errorHandler);

export default app;
