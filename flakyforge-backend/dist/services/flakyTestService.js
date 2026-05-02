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
exports.FlakyTestService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TestRun_1 = require("../models/TestRun");
exports.FlakyTestService = {
    getFlakyTests(userId, page, limit, statusFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const skip = (page - 1) * limit;
            const [result, totalResult] = yield Promise.all([
                TestRun_1.TestRun.aggregate([
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                            status: "completed",
                        },
                    },
                    { $unwind: "$flakyTests" },
                    {
                        $match: Object.assign({ "flakyTests.isFlaky": true }, (statusFilter && { "flakyTests.status": statusFilter })),
                    },
                    {
                        $lookup: {
                            from: "repositories",
                            localField: "repositoryId",
                            foreignField: "_id",
                            as: "repository",
                        },
                    },
                    { $unwind: "$repository" },
                    {
                        $project: {
                            _id: 0,
                            id: "$flakyTests.id",
                            name: "$flakyTests.name",
                            file: "$flakyTests.file",
                            flakyType: "$flakyTests.flakyType",
                            confidence: "$flakyTests.confidence",
                            runs: "$flakyTests.runs",
                            failRate: "$flakyTests.failRate",
                            status: "$flakyTests.status",
                            prNumber: "$flakyTests.prNumber",
                            prUrl: "$flakyTests.prUrl",
                            detected: "$completedAt",
                            repositoryId: "$repository._id",
                            repositoryName: "$repository.fullName",
                        },
                    },
                ]),
                TestRun_1.TestRun.aggregate([
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                            status: "completed",
                        },
                    },
                    { $unwind: "$flakyTests" },
                    {
                        $match: Object.assign({ "flakyTests.isFlaky": true }, (statusFilter && { "flakyTests.status": statusFilter })),
                    },
                    { $count: "total" },
                ]),
            ]);
            const total = ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            return {
                flakyTests: result,
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
    getFlakyTestMetrics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const result = yield TestRun_1.TestRun.aggregate([
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(userId),
                        status: "completed",
                    },
                },
                { $unwind: "$flakyTests" },
                { $match: { "flakyTests.isFlaky": true } },
                {
                    $facet: {
                        stats: [
                            {
                                $group: {
                                    _id: "$flakyTests.status",
                                    count: { $sum: 1 },
                                },
                            },
                        ],
                        today: [
                            {
                                $match: {
                                    completedAt: { $gte: today },
                                },
                            },
                            {
                                $count: "count",
                            },
                        ],
                    },
                },
            ]);
            const counts = (((_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a.stats) || []).reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, { unfixed: 0, pending: 0, fixed: 0 });
            const total = counts.unfixed + counts.pending + counts.fixed;
            const fixRate = total > 0 ? Math.round((counts.fixed / total) * 100) : 0;
            const todayCount = ((_d = (_c = (_b = result === null || result === void 0 ? void 0 : result[0]) === null || _b === void 0 ? void 0 : _b.today) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
            return {
                total,
                breakdown: {
                    fixed: counts.fixed,
                    pending: counts.pending,
                    unfixed: counts.unfixed,
                },
                metrics: {
                    fixRate,
                    today: todayCount,
                },
            };
        });
    },
};
