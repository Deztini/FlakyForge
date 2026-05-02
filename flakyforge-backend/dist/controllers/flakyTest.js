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
exports.FlakyTestController = void 0;
const flakyTestService_1 = require("../services/flakyTestService");
exports.FlakyTestController = {
    getFlakyTests(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const page = Number(req.query.page) || 1;
                const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
                const statusFilter = req.query.status;
                const result = yield flakyTestService_1.FlakyTestService.getFlakyTests(user._id.toString(), page, limit, statusFilter);
                res.status(200).json({
                    success: true,
                    message: "Flaky tests fetched successfully",
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
    getFlakyTestMetrics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = yield flakyTestService_1.FlakyTestService.getFlakyTestMetrics(user._id.toString());
                res.status(200).json({
                    success: true,
                    message: "Flaky test metrics fetched successfully",
                    data: result,
                });
            }
            catch (err) {
                next(err);
            }
        });
    },
};
