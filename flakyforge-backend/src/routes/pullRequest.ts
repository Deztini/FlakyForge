import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { PullRequestController } from "../controllers/pullRequest";

const router = Router();

router.get("/", authenticate, PullRequestController.getPullRequests);

router.get(
  "/metrics",
  authenticate,
  PullRequestController.getPullRequestMetrics,
);

export default router;
