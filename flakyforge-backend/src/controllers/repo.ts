import { NextFunction, Request, Response } from "express";
import z from "zod";
import { IUser } from "../models/User";
import { RepoService } from "../services/repoService";

const connectRepoSchema = z.object({
  repoFullName: z.string(),
  githubRepoId: z.number(),
  language: z.string().nullable(),
  stars: z.number(),
  branch: z.string().default("main"),
  scanTrigger: z
    .enum(["push", "pull_request", "scheduled", "workflow_dispatch"])
    .default("push"),
  autoFixPRs: z.boolean().default(false),
});

export const RepoController = {
  async getAvailable(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const repos = await RepoService.getAvailableRepos(user);
      res.status(200).json({
        success: true,
        message: "Available repositories fetched successfully",
        data: { repos },
      });
    } catch (err) {
      next(err);
    }
  },

  async connect(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const payload = connectRepoSchema.parse(req.body);
      const repository = await RepoService.connectRepos(user, payload);
      res
        .status(201)
        .json({
          sucess: true,
          message: "Repository connected successfully.",
          data: { repository },
        });
    } catch (err) {
      next(err);
    }
  },

  async getUserRepos(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const safeLimit = Math.min(Math.max(limit, 1), 50);

      const result = await RepoService.getUserRepos(
        user._id.toString(),
        page,
        safeLimit,
      );
      res
        .status(200)
        .json({
          success: true,
          message: "Repositories fetched successfully",
          data: result,
        });
    } catch (err) {
      next(err);
    }
  },
};
