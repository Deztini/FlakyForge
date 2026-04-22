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
};
