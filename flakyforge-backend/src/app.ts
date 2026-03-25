import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index"
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use("/api", router);

app.use(errorHandler);

export default app;

