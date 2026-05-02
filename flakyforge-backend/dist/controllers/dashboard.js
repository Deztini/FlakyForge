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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
exports.DashboardController = {
    getDashboardSummary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = yield dashboardService_1.DashboardService.getSummary(user._id.toString());
                return res.status(200).json({
                    success: true,
                    message: "Dashboard summary fetched successfully",
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
    getFlakyTestTrend(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = yield dashboardService_1.DashboardService.getTrend(user._id.toString());
                return res.status(200).json({
                    success: true,
                    message: "Flaky test trend fetched successfully",
                    data: { trends: result },
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
    getRootCauseBreakdown(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = yield dashboardService_1.DashboardService.getRootCauseBreakdown(user._id.toString());
                return res.status(200).json({
                    success: true,
                    message: "Flaky test root cause breakdown fetched successfully",
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
};
