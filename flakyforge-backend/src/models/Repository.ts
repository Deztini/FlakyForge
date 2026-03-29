import mongoose, { Document, Schema } from "mongoose";

export interface IRepository extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  githubRepoId: number;
  language: string | null;
  stars: number;
  branch: string;
  scanTrigger: "push" | "pull_request" | "scheduled" | "workflow_dispatch";
  autoFixPRs: boolean;
  webhookId: number | null;
  status: "active" | "scanning" | "error";
  flakyCount: number;
  fixedCount: number;
  lastScannedAt?: Date;
}

const RepositorySchema = new Schema<IRepository>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    githubRepoId: { type: Number, required: true },
    language: { type: String, default: null },
    stars: { type: Number, default: 0 },
    branch: { type: String, default: "main" },
    scanTrigger: {
      type: String,
      enum: ["push", "pull_request", "scheduled", "workflow_dispatch"],
      default: "push",
    },
    autoFixPRs: { type: Boolean, default: false },
    webhookId: { type: Number, default: null },
    status: {
      type: String,
      enum: ["active", "scanning", "error"],
      default: "active",
    },
    flakyCount: { type: Number, default: 0 },
    fixedCount: { type: Number, default: 0 },
    lastScannedAt: { type: Date },
  },
  { timestamps: true },
);

export const Repository = mongoose.model<IRepository>(
  "Repository",
  RepositorySchema,
);
