import { NextFunction, Request, Response } from "express";
import z from "zod";
import type { IUser } from "../models/User";
import { RepoService } from "../services/repoService";
import { TestRunService } from "../services/testRunService";
import { ApiError } from "../utils/ApiError";

const collectResultsSchema = z.object({
  githubRepoId: z.number(),
  repoFullName: z.string(),
  commitSha: z.string(),
  totalTests: z.number(),
  results: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      failRate: z.number(),
      testCode: z.string(),
      runs: z.number(),
      isFlaky: z.boolean(),
      file: z.string(),
    }),
  ),
});

export const TestRunController = {
  async triggerScan(
    req: Request<{ repoId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.user as IUser;

      const testRun = await RepoService.triggerScan(req.params.repoId, user);

      res.status(201).json({
        message: "Scan triggered successfully",
        testRun,
      });
    } catch (err) {
      next(err);
    }
  },

  async collectResults(
    req: Request<{ repoId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const apiKey = req.headers["x-api-key"] as string;

      if (!apiKey) throw ApiError.unauthorized("Missing API key");

      const payload = collectResultsSchema.parse(req.body);

      const testRun = await RepoService.collectResults(apiKey, payload);

      res.status(201).json({
        message: "Results collected successfully",
        testRun,
      });
    } catch (err) {
      next(err);
    }
  },

  async getTestRuns(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

      const result = await TestRunService.getTestRuns(
        user._id.toString(),
        page,
        limit,
      );

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const metrics = await TestRunService.getMetrics(user._id.toString());
      res.status(200).json(metrics);
    } catch (err) {
      next(err);
    }
  },
};
