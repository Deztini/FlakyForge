import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { RepoController } from "../controllers/repo";

const router = Router();

router.use(authenticate);

router.get("/available", RepoController.getAvailable);
router.get("/", RepoController.getUserRepos);
router.post("/connect", RepoController.connect);

export default router;
