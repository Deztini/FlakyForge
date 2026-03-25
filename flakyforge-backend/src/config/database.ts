import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MONGODB connection successful");
  } catch (error) {
    console.error("MONGODB connection failed", error);
  }
}
