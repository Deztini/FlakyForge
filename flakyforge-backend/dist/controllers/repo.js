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
exports.RepoController = void 0;
const zod_1 = __importDefault(require("zod"));
const repoService_1 = require("../services/repoService");
const connectRepoSchema = zod_1.default.object({
    repoFullName: zod_1.default.string(),
    githubRepoId: zod_1.default.number(),
    language: zod_1.default.string().nullable(),
    stars: zod_1.default.number(),
    branch: zod_1.default.string().default("main"),
    scanTrigger: zod_1.default
        .enum(["push", "pull_request", "scheduled", "workflow_dispatch"])
        .default("push"),
    autoFixPRs: zod_1.default.boolean().default(false),
});
exports.RepoController = {
    getAvailable(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const repos = yield repoService_1.RepoService.getAvailableRepos(user);
                res.status(200).json({
                    success: true,
                    message: "Available repositories fetched successfully",
                    data: { repos },
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
    connect(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const payload = connectRepoSchema.parse(req.body);
                const repository = yield repoService_1.RepoService.connectRepos(user, payload);
                res
                    .status(201)
                    .json({
                    sucess: true,
                    message: "Repository connected successfully.",
                    data: { repository },
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
    getUserRepos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const safeLimit = Math.min(Math.max(limit, 1), 50);
                const result = yield repoService_1.RepoService.getUserRepos(user._id.toString(), page, safeLimit);
                res
                    .status(200)
                    .json({
                    success: true,
                    message: "Repositories fetched successfully",
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
};
