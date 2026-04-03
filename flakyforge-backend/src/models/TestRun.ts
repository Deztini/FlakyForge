import mongoose, { Document, Schema } from "mongoose";

interface IFlakyResult {
  name: string;
  failRate: number;
  runs: number;
  isFlaky: boolean;
}

export interface ITestRun extends Document {
  repositoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  githubRepoId: number;
  status: "pending" | "running" | "completed" | "failed";
  triggeredBy: "manual" | "push" | "pull_request" | "scheduled";
  flakyTests: IFlakyResult[];
  flakyCount: number;
  totalRuns: number;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
}

const FlakyResultSchema = new Schema<IFlakyResult>({
  name: { type: String, required: true },
  failRate: { type: Number, required: true },
  runs: { type: Number, required: true },
  isFlaky: { type: Boolean, required: true },
});

const TestRunSchema = new Schema<ITestRun>(
  {
    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    githubRepoId: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
    },
    triggeredBy: {
      type: String,
      enum: ["push", "pull_request", "scheduled", "workflow_dispatch"],
      default: "manual",
    },
    flakyTests: [FlakyResultSchema],
    flakyCount: { type: Number, default: 0 },
    totalRuns: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export const TestRun = mongoose.model<ITestRun>("TestRun", TestRunSchema);
