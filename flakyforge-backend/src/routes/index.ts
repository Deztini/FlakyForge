import Router from "express";
import authRoutes from "./auth";
import repoRoutes from "./repo";
import testRunRoutes from "./testRun";

const router = Router();

router.use("/auth", authRoutes);
router.use("/repo", repoRoutes);
router.use("/test-runs", testRunRoutes);


export default router;