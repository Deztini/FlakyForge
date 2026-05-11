import { Request, Response, NextFunction } from "express";
import { ApplyFixService } from "../services/applyFixService";
import { applyFixSchema } from "../validators/applyfix.schema";
import { IUser } from "../models/User";

export const ApplyFixController = {
  async applyFix(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser
      const { testRunId, flakyTestId } = applyFixSchema.parse(req.body);

      const result = await ApplyFixService.applyFix({
        testRunId,
        flakyTestId,
        userId: user._id.toString(),
      });

      res.status(201).json({
        success: true,
        message: "Fix applied successfully. Pull request has been opened.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};