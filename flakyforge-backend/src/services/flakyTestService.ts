import mongoose from "mongoose";
import { TestRun } from "../models/TestRun";

export const FlakyTestService = {
  async getFlakyTests(
    userId: string,
    page: number,
    limit: number,
    statusFilter?: "unfixed" | "pending" | "fixed",
  ) {
    const skip = (page - 1) * limit;

    const [result, totalResult] = await Promise.all([
      TestRun.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: "completed",
          },
        },

        { $unwind: "$flakyTests" },

        {
          $match: {
            "flakyTests.isFlaky": true,
            ...(statusFilter && { "flakyTests.status": statusFilter }),
          },
        },

        {
          $lookup: {
            from: "repositories",
            localField: "repositoryId",
            foreignField: "_id",
            as: "repository",
          },
        },

        { $unwind: "$repository" },

        {
          $project: {
            _id: 0,
            id: "$flakyTests.id",
            name: "$flakyTests.name",
            file: "$flakyTests.file",
            flakyType: "$flakyTests.flakyType",
            confidence: "$flakyTests.confidence",
            runs: "$flakyTests.runs",
            failRate: "$flakyTests.failRate",
            status: "$flakyTests.status",
            prNumber: "$flakyTests.prNumber",
            prUrl: "$flakyTests.prUrl",
            detected: "$completedAt",
            repositoryId: "$repository._id",
            repositoryName: "$repository.fullName",
          },
        },
      ]),

      TestRun.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            status: "completed",
          },
        },
        { $unwind: "$flakyTests" },
        {
          $match: {
            "flakyTests.isFlaky": true,
            ...(statusFilter && { "flakyTests.status": statusFilter }),
          },
        },
        { $count: "total" },
      ]),
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      flakyTests: result,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  },

  async getFlakyTestMetrics(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await TestRun.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: "completed",
        },
      },
      { $unwind: "$flakyTests" },
      { $match: { "flakyTests.isFlaky": true } },

      {
        $facet: {
          stats: [
            {
              $group: {
                _id: "$flakyTests.status",
                count: { $sum: 1 },
              },
            },
          ],

          today: [
            {
              $match: {
                completedAt: { $gte: today },
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const counts = (result?.[0]?.stats || []).reduce(
      (acc: Record<string, number>, item: any) => {
        acc[item._id] = item.count;
        return acc;
      },
      { unfixed: 0, pending: 0, fixed: 0 },
    );

    const total = counts.unfixed + counts.pending + counts.fixed;

    const fixRate = total > 0 ? Math.round((counts.fixed / total) * 100) : 0;

    const todayCount = result?.[0]?.today?.[0]?.count || 0;

    return {
      total,
      breakdown: {
        fixed: counts.fixed,
        pending: counts.pending,
        unfixed: counts.unfixed,
      },
      metrics: {
        fixRate,
        today: todayCount,
      },
    };
  },
};
