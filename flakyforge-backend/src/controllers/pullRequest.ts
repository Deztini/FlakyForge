import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User";
import { DashboardService } from "../services/dashboardService";
import { PullRequestService } from "../services/pullRequestService";

export const PullRequestController = {
  async getPullRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

      const stateFilter = req.query.state as
        | "open"
        | "merged"
        | "closed"
        | undefined;

      const result = await PullRequestService.getPullRequests(
        user._id.toString(),
        page,
        limit,
        stateFilter,
      );

      return res.status(200).json({
        success: true,
        message: "Pull Requests fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getPullRequestMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;

      const result = await PullRequestService.getPullRequestMetrics(
        user._id.toString(),
      );

      return res.status(200).json({
        success: true,
        message: "Pull Request metrics fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
