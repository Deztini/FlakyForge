"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const flakyTest_1 = require("../controllers/flakyTest");
const router = (0, express_1.Router)();
router.get("/", authenticate_1.authenticate, flakyTest_1.FlakyTestController.getFlakyTests);
router.get("/metrics", authenticate_1.authenticate, flakyTest_1.FlakyTestController.getFlakyTestMetrics);
exports.default = router;
