import Router from "express";
import authRoutes from "./auth";
import repoRoutes from "./repo";
import testRunRoutes from "./testRun";
import flakyTestRoutes from "./flakyTest";
import dashboardRoutes from "./dashboard";
import pullRequestRoutes from "./pullRequest";

const router = Router();

router.use("/auth", authRoutes);
router.use("/repo", repoRoutes);
router.use("/test-runs", testRunRoutes);
router.use("/flaky-tests", flakyTestRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/pull-requests", pullRequestRoutes);

export default router;
