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
};
