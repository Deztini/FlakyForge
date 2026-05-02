"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRun = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const FlakyResultSchema = new mongoose_1.Schema({
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
const TestRunSchema = new mongoose_1.Schema({
    repositoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Repository",
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret._v;
        },
    },
});
exports.TestRun = mongoose_1.default.model("TestRun", TestRunSchema);
