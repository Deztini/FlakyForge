"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunController = void 0;
const zod_1 = __importDefault(require("zod"));
const repoService_1 = require("../services/repoService");
const testRunService_1 = require("../services/testRunService");
const ApiError_1 = require("../utils/ApiError");
const collectResultsSchema = zod_1.default.object({
    githubRepoId: zod_1.default.number(),
    repoFullName: zod_1.default.string(),
    commitSha: zod_1.default.string(),
    totalTests: zod_1.default.number(),
    results: zod_1.default.array(zod_1.default.object({
        id: zod_1.default.string(),
        name: zod_1.default.string(),
        failRate: zod_1.default.number(),
        testCode: zod_1.default.string(),
        runs: zod_1.default.number(),
        isFlaky: zod_1.default.boolean(),
        file: zod_1.default.string(),
    })),
});
exports.TestRunController = {
    triggerScan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const testRun = yield repoService_1.RepoService.triggerScan(req.params.repoId, user);
                res.status(201).json({
                    success: true,
                    message: "Scan triggered successfully",
                    data: { testRun },
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
    collectResults(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = req.headers["x-api-key"];
                if (!apiKey)
                    throw ApiError_1.ApiError.unauthorized("Missing API key");
                const payload = collectResultsSchema.parse(req.body);
                const testRun = yield repoService_1.RepoService.collectResults(apiKey, payload);
                res.status(201).json({
                    success: true,
                    message: "Results collected successfully",
                    data: { testRun },
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
    getTestRuns(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const page = Number(req.query.page) || 1;
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
                const result = yield testRunService_1.TestRunService.getTestRuns(user._id.toString(), page, limit);
                res.status(200).json({
                    success: true,
                    message: "Test runs fetched successfully",
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
    getMetrics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const metrics = yield testRunService_1.TestRunService.getMetrics(user._id.toString());
                res
                    .status(200)
                    .json({
                    success: true,
                    message: "Metrics fetched successfully",
                    data: metrics,
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
};
