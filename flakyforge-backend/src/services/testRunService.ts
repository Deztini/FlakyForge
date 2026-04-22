import mongoose from "mongoose";
import { TestRun } from "../models/TestRun";

export const TestRunService = {
  async getTestRuns(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [testRuns, total] = await Promise.all([
      TestRun.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("repositoryId", "fullName branch language"),
      TestRun.countDocuments({ userId }),
    ]);

    return {
      testRuns,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / page),
        hasNext: page < Math.ceil(total / page),
        hasPrev: page > 1,
      },
    };
  },

  async getMetrics(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalRuns, runsToday, avgResult] = await Promise.all([
      TestRun.countDocuments({ userId, status: "completed" }),
      TestRun.countDocuments({ userId, startedAt: { $gte: today } }),
      TestRun.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: "completed",
            duration: { $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: "$duration" },
          },
        },
      ]),
    ]);

    const avg = avgResult[0];

    const cleanRuns = await TestRun.countDocuments({
      userId,
      status: "completed",
      flakyCount: 0,
    });

    const successRate =
      totalRuns > 0 ? Math.round((cleanRuns / totalRuns) * 100) : 0;

    return {
      totalRuns,
      runsToday,
      successRate,
      avgDuration: Math.floor(avg?.avgDuration || 0),
    };
  },
};
