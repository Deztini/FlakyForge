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
exports.TestRunService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TestRun_1 = require("../models/TestRun");
exports.TestRunService = {
    getTestRuns(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const [testRuns, total] = yield Promise.all([
                TestRun_1.TestRun.find({ userId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate("repositoryId", "fullName branch language"),
                TestRun_1.TestRun.countDocuments({ userId }),
            ]);
            const result = {
                testRuns,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1,
                },
            };
            return result;
        });
    },
    getMetrics(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const [totalRuns, runsToday, avgResult] = yield Promise.all([
                TestRun_1.TestRun.countDocuments({ userId, status: "completed" }),
                TestRun_1.TestRun.countDocuments({ userId, startedAt: { $gte: today } }),
                TestRun_1.TestRun.aggregate([
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                            status: "completed",
                            duration: { $ne: null },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            avgDuration: { $avg: "$duration" },
                        },
                    },
                ]),
            ]);
            const avg = avgResult[0];
            const cleanRuns = yield TestRun_1.TestRun.countDocuments({
                userId,
                status: "completed",
                flakyCount: 0,
            });
            const successRate = totalRuns > 0 ? Math.round((cleanRuns / totalRuns) * 100) : 0;
            const result = {
                totalRuns,
                runsToday,
                successRate,
                avgDuration: Math.floor((avg === null || avg === void 0 ? void 0 : avg.avgDuration) || 0),
            };
            return result;
        });
    },
};
