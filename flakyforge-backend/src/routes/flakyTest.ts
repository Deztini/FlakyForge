import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { FlakyTestController } from "../controllers/flakyTest";
import { ApplyFixController } from "../controllers/applyFix";

const router = Router();

router.get("/", authenticate, FlakyTestController.getFlakyTests);

router.get("/metrics", authenticate, FlakyTestController.getFlakyTestMetrics);

router.post("/apply-fix", authenticate, ApplyFixController.applyFix);

export default router;
