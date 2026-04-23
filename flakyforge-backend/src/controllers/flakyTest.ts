import { NextFunction, Response, Request } from "express";
import { IUser } from "../models/User";
import { FlakyTestService } from "../services/flakyTestService";

export const FlakyTestController = {
  async getFlakyTests(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

      const statusFilter = req.query.status as
        | "unfixed"
        | "pending"
        | "fixed"
        | undefined;

      const result = await FlakyTestService.getFlakyTests(
        user._id.toString(),
        page,
        limit,
        statusFilter,
      );

      res.status(200).json({
        success: true,
        message: "Flaky tests fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getFlakyTestMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;

      const result = await FlakyTestService.getFlakyTestMetrics(
        user._id.toString(),
      );

      res.status(200).json({
        success: true,
        message: "Flaky test metrics fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
