import mongoose, { Document, Schema } from "mongoose";

interface IFlakyResult {
  id: string;
  name: string;
  failRate: number;
  file: string;
  testCode: string;
  runs: number;
  isFlaky: boolean;
  flakyType?: "async wait" | "concurrency" | "network";
  confidence?: number;
  status: "unfixed" | "pending" | "fixed";
  prNumber: number;
  prUrl: string;
}

export interface ITestRun extends Document {
  repositoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  githubRepoId: number;
  status: "pending" | "running" | "completed" | "failed";
  triggeredBy: "workflow_dispatch" | "push" | "pull_request" | "scheduled";
  flakyTests: IFlakyResult[];
  flakyCount: number;
  totalRuns: number;
  commitSha: string;
  totalTests: number;
  duration: number;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
}

const FlakyResultSchema = new Schema<IFlakyResult>({
  name: { type: String, required: true },
  file: { type: String, default: "" },
  testCode: { type: String, default: "" },
  failRate: { type: Number, required: true },
  runs: { type: Number, required: true },
  isFlaky: { type: Boolean, required: true },
  flakyType: { type: String, enum: ["async wait", "concurrency", "network"] },
  confidence: { type: Number },
  status: {
    type: String,
    enum: ["unfixed", "pending", "fixed"],
    default: "unfixed",
  },
  prNumber: { type: Number, default: null },
  prUrl: { type: String, default: null },
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
      default: "workflow_dispatch",
    },
    flakyTests: [FlakyResultSchema],
    flakyCount: { type: Number, default: 0 },
    totalRuns: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    commitSha: { type: String, default: null },
    duration: { type: Number, default: null },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete (ret as any)._id;
        delete (ret as any)._v;
      },
    },
  },
);

export const TestRun = mongoose.model<ITestRun>("TestRun", TestRunSchema);
