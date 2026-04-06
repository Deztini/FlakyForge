import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { TestRunController } from "../controllers/testRun";

const router = Router();

router.post("/:repoId/trigger", authenticate, TestRunController.triggerScan);

router.post("/results", TestRunController.collectResults);

export default router;
