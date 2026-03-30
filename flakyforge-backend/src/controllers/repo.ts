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
      res.status(200).json(repos);
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
        .json({ message: "Repository connected successfully.", repository });
    } catch (err) {
      next(err);
    }
  },

  async getUserRepos(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const repos = await RepoService.getUserRepos(user._id.toString());
      res.status(200).json(repos);
    } catch (err) {
      next(err);
    }
  },
};
