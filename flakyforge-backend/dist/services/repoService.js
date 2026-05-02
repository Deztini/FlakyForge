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
exports.RepoService = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const ApiError_1 = require("../utils/ApiError");
const Repository_1 = require("../models/Repository");
const env_1 = require("../config/env");
const injectWorflowFiles_1 = require("../utils/injectWorflowFiles");
const TestRun_1 = require("../models/TestRun");
const classifierService_1 = require("./classifierService");
exports.RepoService = {
    getAvailableRepos(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.githubAccessToken) {
                throw ApiError_1.ApiError.badRequest("No Github token found. Please logout and sign in with Github again");
            }
            const { data } = yield axios_1.default.get("https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator", { headers: { Authorization: `Bearer ${user.githubAccessToken}` } });
            const connected = yield Repository_1.Repository.find({ userId: user._id }).select("githubRepoId");
            const connectedId = new Set(connected.map((r) => r.githubRepoId));
            return data
                .filter((r) => !connectedId.has(r.id))
                .map((r) => ({
                id: r.id,
                fullName: r.full_name,
                language: r.language,
                stars: r.stargazers_count,
                isPrivate: r.private,
                defaultBranch: r.default_branch,
                description: r.description,
            }));
        });
    },
    connectRepos(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log(payload.repoFullName);
            if (!user.githubAccessToken) {
                throw ApiError_1.ApiError.badRequest("No Github token found. Please logout and sign in with Github again");
            }
            const existing = yield Repository_1.Repository.findOne({
                userId: user._id,
                githubRepoId: payload.githubRepoId,
            });
            if (existing)
                throw ApiError_1.ApiError.badRequest("Repository is already connected");
            const [owner, repo] = payload.repoFullName.split("/");
            const webhookEvents = ["push", "pull_request", "check_run"];
            let webhookId = null;
            try {
                const webhookRes = yield axios_1.default.post(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
                    owner,
                    repo,
                    name: "web",
                    active: true,
                    events: webhookEvents,
                    config: {
                        url: `${env_1.env.NGROK_URL}/webhooks/github`,
                        content_type: "json",
                        secret: env_1.env.WEBHOOK_SECRET,
                    },
                }, {
                    headers: { Authorization: `Bearer ${user.githubAccessToken}` },
                });
                webhookId = webhookRes.data.id;
            }
            catch (err) {
                if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) !== 422) {
                    throw ApiError_1.ApiError.badRequest("Failed to install GitHub webhook");
                }
            }
            const apiKey = crypto_1.default.randomBytes(32).toString("hex");
            yield (0, injectWorflowFiles_1.injectWorkflowFiles)(owner, repo, payload.branch, user.githubAccessToken, apiKey, env_1.env.BACKEND_URL);
            const repository = yield Repository_1.Repository.create({
                userId: user._id,
                fullName: payload.repoFullName,
                githubRepoId: payload.githubRepoId,
                language: payload.language,
                stars: payload.stars,
                branch: payload.branch,
                scanTrigger: payload.scanTrigger,
                autoFixPRs: payload.autoFixPRs,
                webhookId,
                flakyCount: 0,
                fixedCount: 0,
                apiKey,
            });
            return repository;
        });
    },
    getUserRepos(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [repos, total] = yield Promise.all([
                Repository_1.Repository.find({ userId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .select("-apiKey"),
                Repository_1.Repository.countDocuments({ userId }),
            ]);
            return {
                repos,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1,
                },
            };
        });
    },
    triggerScan(repoId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.githubAccessToken) {
                throw ApiError_1.ApiError.badRequest("No Github token found. Please logout and sign in with Github again");
            }
            const repository = yield Repository_1.Repository.findOne({
                _id: repoId,
                userId: user._id,
            });
            if (!repository)
                throw ApiError_1.ApiError.notFound("No repository found");
            const [owner, repo] = repository.fullName.split("/");
            yield axios_1.default.post(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/flakeyradar.yml/dispatches`, {
                ref: repository.branch,
            }, { headers: { Authorization: `Bearer ${user.githubAccessToken}` } });
            const testRun = yield TestRun_1.TestRun.create({
                repositoryId: repository._id,
                userId: user._id,
                githubRepoId: repository.githubRepoId,
                status: "pending",
                triggeredBy: "workflow_dispatch",
                startedAt: new Date(),
            });
            yield Repository_1.Repository.findByIdAndUpdate(repoId, { status: "scanning" });
            return testRun;
        });
    },
    collectResults(apiKey, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield Repository_1.Repository.findOne({ apiKey });
            if (!repository)
                throw ApiError_1.ApiError.unauthorized("Invalid API key");
            if (repository.githubRepoId !== payload.githubRepoId) {
                throw ApiError_1.ApiError.badRequest("Repo ID mismatch");
            }
            const flakyTests = payload.results.filter((t) => t.isFlaky);
            const flakyCount = flakyTests.length;
            const totalRuns = payload.results.reduce((sum, t) => sum + t.runs, 0);
            const pendingTestRun = yield TestRun_1.TestRun.findOne({ repositoryId: repository._id, status: "pending" }, null, { sort: { startedAt: -1 } });
            if (!pendingTestRun)
                throw ApiError_1.ApiError.notFound("No pending test run found for this repo");
            const duration = Math.floor((Date.now() - pendingTestRun.startedAt.getTime()) / 1000);
            const testRun = yield TestRun_1.TestRun.findOneAndUpdate({ repositoryId: repository._id, status: "pending" }, {
                $set: {
                    flakyCount,
                    totalRuns,
                    totalTests: payload.totalTests,
                    commitSha: payload.commitSha,
                    duration,
                    flakyTests: payload.results,
                    completedAt: new Date(),
                    status: "completed",
                },
            }, {
                new: true,
                sort: { startedAt: -1 },
            });
            if (!testRun)
                throw ApiError_1.ApiError.notFound("No pending test run found for this repo");
            yield Repository_1.Repository.findByIdAndUpdate(repository._id, {
                $set: {
                    flakyCount,
                    lastScannedAt: new Date(),
                    status: "active",
                },
            });
            if (flakyTests.length > 0) {
                classifyAndUpdateTestRun(testRun._id.toString(), flakyTests);
            }
            return testRun;
        });
    },
    updateScanCounts(repoId, flakyCount, fixedCount) {
        return __awaiter(this, void 0, void 0, function* () {
            return Repository_1.Repository.findByIdAndUpdate(repoId, {
                $set: {
                    flakyCount,
                    fixedCount,
                    lastScannedAt: new Date(),
                    status: "active",
                },
            }, { new: true });
        });
    },
};
function classifyAndUpdateTestRun(testRunId, flakyTests) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Classifying ${flakyTests.length} flaky tests...`);
            const classificationMap = yield classifierService_1.ClassifierService.classifyFlakyTests(flakyTests.map((t) => ({ id: t.id, testCode: t.testCode })));
            console.log(classificationMap);
            const updatedFlakyTests = flakyTests.map((test) => {
                const classification = classificationMap.get(test.id);
                return Object.assign(Object.assign({}, test), { flakyType: classification === null || classification === void 0 ? void 0 : classification.label, confidence: classification === null || classification === void 0 ? void 0 : classification.confidence });
            });
            yield TestRun_1.TestRun.findByIdAndUpdate(testRunId, {
                $set: { flakyTests: updatedFlakyTests },
            });
            console.log(`Classification complete for test run ${testRunId}`);
        }
        catch (err) {
            console.error("Background classification failed:", err);
        }
    });
}
