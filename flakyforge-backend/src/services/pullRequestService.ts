import { TestRun } from "../models/TestRun";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";
import { GithubService } from "./githubService";

export const PullRequestService = {
  async getPullRequests(
    userId: string,
    page: number,
    limit: number,
    stateFilter?: "open" | "merged" | "closed",
  ) {
    const user = await User.findById(userId).select("+githubAccessToken");
    if (!user?.githubAccessToken) {
      throw ApiError.unauthorized(
        "GitHub token not found. Please reconnect your GitHub account.",
      );
    }

    const testWithPRs = await TestRun.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: "completed",
        },
      },

      { $unwind: "$flakyTests" },

      {
        $match: {
          "flakyTests.prNumber": { $exists: true, $ne: null },
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
          prNumber: "$flakyTests.prNumber",
          prUrl: "$flakyTests.prUrl",
          explanation: "$flakyTests.explanation",
          testName: "$flakyTests.name",
          flakyType: "$flakyTests.flakyType",
          repositoryFullName: "$repository.fullName",
          detectedAt: "$completedAt",
        },
      },
    ]);

    const prDetails = await Promise.all(
      testWithPRs.map(async (item) => {
        try {
          const pr = await GithubService.getPullRequest(
            user.githubAccessToken!,
            item.prNumber,
            item.repositoryFullName,
          );

          const state: "open" | "closed" | "merged" = pr.merged
            ? "merged"
            : pr.state;

          return {
            prNumber: pr.number,
            prUrl: pr.html_url,
            title: pr.title,
            explanation: item.explanation || "No explanation available.",
            state,
            branch: pr.head.ref,
            createdAt: pr.created_at,
            additions: pr.additions,
            deletions: pr.deletions,
            repositoryName: item.repositoryFullName,
            flakyType: item.flakyType,
            testName: item.testName,
          };
        } catch {
          return null;
        }
      }),
    );

      const validPRs = prDetails.filter(
      (pr) => pr !== null
    );

    const filtered = stateFilter
      ? validPRs.filter((pr) => pr.state === stateFilter)
      : validPRs;

    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      pullRequests: paginated,
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
