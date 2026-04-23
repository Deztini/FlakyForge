import Router from "express";
import authRoutes from "./auth";
import repoRoutes from "./repo";
import testRunRoutes from "./testRun";
import flakyTestRoutes from "./flakyTest";

const router = Router();

router.use("/auth", authRoutes);
router.use("/repo", repoRoutes);
router.use("/test-runs", testRunRoutes);
router.use("/flaky-tests", flakyTestRoutes);

export default router;
