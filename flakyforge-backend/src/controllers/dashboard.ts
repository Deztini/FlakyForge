import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/User";
import { DashboardService } from "../services/dashboardService";

export const DashboardController = {
  async getDashboardSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;

      const result = await DashboardService.getSummary(user._id.toString());

      return res.status(200).json({
        success: true,
        message: "Dashboard summary fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getFlakyTestTrend(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;

      const result = await DashboardService.getTrend(user._id.toString());

      return res.status(200).json({
        success: true,
        message: "Flaky test trend fetched successfully",
        data: { result },
      });
    } catch (err) {
      next(err);
    }
  },
};
