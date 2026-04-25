import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { DashboardController } from "../controllers/dashboard";

const router = Router();

router.get("/summary", authenticate, DashboardController.getDashboardSummary);


router.get("/flaky-tests/trends", authenticate, DashboardController.getFlakyTestTrend);


router.get("/flaky-tests/root-cause", authenticate, DashboardController.getRootCauseBreakdown);