import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { RepoController } from "../controllers/repo";

const router = Router();

router.use(authenticate);

router.get("/available", RepoController.getAvailable); // list available repos
router.get("/", RepoController.getUserRepos); // list all user repo
router.post("/connect", RepoController.connect); // connects repo and injects Workflow

export default router;
