import {Router} from "express";
import { authenticate } from "../middleware/authenticate";
import { FlakyTestController } from "../controllers/flakyTest";

const router = Router();

router.get("/", authenticate, FlakyTestController.getFlakyTests);

router.get("/metrics", authenticate, FlakyTestController.getFlakyTestMetrics);

export default router;