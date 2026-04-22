import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { TestRunController } from "../controllers/testRun";

const router = Router();

router.post("/results", TestRunController.collectResults);

router.get("/", authenticate, TestRunController.getTestRuns);

router.get("/metrics", authenticate, TestRunController.getMetrics);

router.post("/:repoId/trigger", authenticate, TestRunController.triggerScan);

export default router;
