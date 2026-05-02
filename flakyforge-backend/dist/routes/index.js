"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const repo_1 = __importDefault(require("./repo"));
const testRun_1 = __importDefault(require("./testRun"));
const flakyTest_1 = __importDefault(require("./flakyTest"));
const dashboard_1 = __importDefault(require("./dashboard"));
const router = (0, express_1.default)();
router.use("/auth", auth_1.default);
router.use("/repo", repo_1.default);
router.use("/test-runs", testRun_1.default);
router.use("/flaky-tests", flakyTest_1.default);
router.use("/dashboard", dashboard_1.default);
exports.default = router;
