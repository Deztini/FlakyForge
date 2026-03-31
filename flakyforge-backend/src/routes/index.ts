import Router from "express";
import authRoutes from "./auth";
import repoRoutes from "./repo";

const router = Router();

router.use("/auth", authRoutes);
router.use("/repo", repoRoutes);

export default router;