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
exports.DashboardService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TestRun_1 = require("../models/TestRun");
const date_1 = require("../utils/date");
exports.DashboardService = {
    getSummary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrowStart = new Date(today);
            tomorrowStart.setDate(today.getDate() + 1);
            const { thisWeekStart, thisWeekEnd, lastWeekEnd, lastWeekStart } = (0, date_1.getWeekRanges)();
            const [thisWeekTests, lastWeekTests, flakyAgg, fixedAgg, confidenceAgg] = yield Promise.all([
                TestRun_1.TestRun.aggregate([
                    {
                        $match: {
                            userId: userObjectId,
                            createdAt: { $gte: thisWeekStart, $lt: thisWeekEnd },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$totalTests" },
                        },
                    },
                ]),
                TestRun_1.TestRun.aggregate([
                    {
                        $match: {
                            userId: userObjectId,
                            createdAt: {
                                $gte: lastWeekStart,
                                $lt: lastWeekEnd,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$totalTests" },
                        },
                    },
                ]),
                TestRun_1.TestRun.aggregate([
                    { $match: { userId: userObjectId, status: "completed" } },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$flakyCount" },
                            today: {
                                $sum: {
                                    $cond: [
                                        {
                                            $and: [
                                                { $gte: ["$createdAt", today] },
                                                { $lt: ["$createdAt", tomorrowStart] },
                                            ],
                                        },
                                        "$flakyCount",
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                ]),
                TestRun_1.TestRun.aggregate([
                    { $match: { userId: userObjectId, status: "completed" } },
                    { $unwind: "$flakyTests" },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: {
                                    $cond: [{ $eq: ["$flakyTests.status", "fixed"] }, 1, 0],
                                },
                            },
                            today: {
                                $sum: {
                                    $cond: [
                                        {
                                            $and: [
                                                { $eq: ["$flakyTests.status", "fixed"] },
                                                { $gte: ["$createdAt", today] },
                                                { $lt: ["$createdAt", tomorrowStart] },
                                            ],
                                        },
                                        1,
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                ]),
                TestRun_1.TestRun.aggregate([
                    { $match: { userId: userObjectId, status: "completed" } },
                    { $unwind: "$flakyTests" },
                    {
                        $match: { "flakyTests.confidence": { $exists: true } },
                    },
                    {
                        $group: {
                            _id: null,
                            avg: { $avg: "$flakyTests.confidence" },
                            todayAvg: {
                                $avg: {
                                    $cond: [
                                        { $gte: ["$createdAt", today] },
                                        "$flakyTests.confidence",
                                        null,
                                    ],
                                },
                            },
                        },
                    },
                ]),
            ]);
            const currentWeekTotal = ((_a = thisWeekTests[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            const lastWeekTotal = ((_b = lastWeekTests[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
            let totalTestsChange = 0;
            if (lastWeekTotal === 0) {
                totalTestsChange = currentWeekTotal > 0 ? 100 : 0;
            }
            else {
                const raw = Math.round(((currentWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);
                totalTestsChange = Math.max(Math.min(raw, 999), -100);
            }
            return {
                totalTests: {
                    value: currentWeekTotal,
                    change: totalTestsChange,
                },
                flakyTests: {
                    value: ((_c = flakyAgg[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
                    change: ((_d = flakyAgg[0]) === null || _d === void 0 ? void 0 : _d.today) || 0,
                },
                testsFixed: {
                    value: ((_e = fixedAgg[0]) === null || _e === void 0 ? void 0 : _e.total) || 0,
                    change: ((_f = fixedAgg[0]) === null || _f === void 0 ? void 0 : _f.today) || 0,
                },
                avgConfidence: {
                    value: Number((((_g = confidenceAgg[0]) === null || _g === void 0 ? void 0 : _g.avg) || 0).toFixed(2)),
                    change: Number((((_h = confidenceAgg[0]) === null || _h === void 0 ? void 0 : _h.todayAvg) || 0).toFixed(2)),
                },
            };
        });
    },
    getTrend(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const { thisWeekStart, thisWeekEnd } = (0, date_1.getWeekRanges)();
            const [detectedRaw, fixedRaw] = yield Promise.all([
                TestRun_1.TestRun.aggregate([
                    {
                        $match: {
                            userId: userObjectId,
                            status: "completed",
                            createdAt: { $gte: thisWeekStart, $lt: thisWeekEnd },
                        },
                    },
                    {
                        $group: {
                            _id: { $dayOfWeek: "$createdAt" },
                            detected: { $sum: "$flakyCount" },
                        },
                    },
                ]),
                TestRun_1.TestRun.aggregate([
                    {
                        $match: {
                            userId: userObjectId,
                            status: "completed",
                            createdAt: { $gte: thisWeekStart, $lt: thisWeekEnd },
                        },
                    },
                    { $unwind: "$flakyTests" },
                    {
                        $match: {
                            "flakyTests.status": "fixed",
                        },
                    },
                    {
                        $group: {
                            _id: { $dayOfWeek: "$createdAt" },
                            fixed: { $sum: 1 },
                        },
                    },
                ]),
            ]);
            const DAY_MAP = {
                2: "Mon",
                3: "Tue",
                4: "Wed",
                5: "Thur",
                6: "Fri",
                7: "Sat",
                1: "Sun",
            };
            const detectedMap = {};
            for (const item of detectedRaw) {
                detectedMap[item._id] = item.detected;
            }
            const fixedMap = {};
            for (const item of fixedRaw) {
                fixedMap[item._id] = item.fixed;
            }
            const trends = [2, 3, 4, 5, 6, 7, 1].map((dayNum) => {
                var _a, _b;
                return ({
                    day: DAY_MAP[dayNum],
                    detected: (_a = detectedMap[dayNum]) !== null && _a !== void 0 ? _a : 0,
                    fixed: (_b = fixedMap[dayNum]) !== null && _b !== void 0 ? _b : 0,
                });
            });
            return trends;
        });
    },
    getRootCauseBreakdown(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            const breakdown = yield TestRun_1.TestRun.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        status: "completed",
                    },
                },
                { $unwind: "$flakyTests" },
                {
                    $match: {
                        "flakyTests.flakyType": { $exists: true, $ne: null },
                    },
                },
                {
                    $group: {
                        _id: "$flakyTests.flakyType",
                        count: { $sum: 1 },
                    },
                },
            ]);
            const total = breakdown.reduce((sum, item) => sum + item.count, 0);
            if (total === 0) {
                return {
                    total: 0,
                    breakdown: [
                        { type: "async wait", count: 0, percentage: 0 },
                        { type: "concurrency", count: 0, percentage: 0 },
                        { type: "network", count: 0, percentage: 0 },
                    ],
                };
            }
            const CATEGORIES = ["async wait", "concurrency", "network"];
            const countMap = {};
            for (const item of breakdown) {
                countMap[item._id] = item.count;
            }
            const result = CATEGORIES.map((category) => {
                const count = countMap[category];
                const percentage = Math.round((count / total) * 100);
                return { type: category, count, percentage };
            });
            return {
                total,
                breakdown: result,
            };
        });
    },
};
