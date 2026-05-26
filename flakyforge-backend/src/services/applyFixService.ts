import mongoose from "mongoose";
import { TestRun } from "../models/TestRun";
import { Repository } from "../models/Repository";
import { User } from "../models/User";
import { RuleEngineService } from "./ruleEngine/pipeline/ruleEngineService";
import { GithubService } from "./githubService";
import { ApiError } from "../utils/ApiError";

const sanitizeBranchName = (testName: string): string =>
  testName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

interface ApplyFixInput {
  testRunId: string;
  flakyTestId: string;
  userId: string;
}

interface ApplyFixResult {
  prNumber: number;
  prUrl: string;
  fixBranch: string;
}

export const ApplyFixService = {
  async applyFix(input: ApplyFixInput): Promise<ApplyFixResult> {
    const { testRunId, flakyTestId, userId } = input;

    const testRun = await TestRun.findOne({ _id: testRunId, userId });
    if (!testRun) {
      throw ApiError.notFound("Test run not found");
    }
    console.log("test run found");

    const flakyTest = testRun.flakyTests.find(
      (t) => t._id.toString() === flakyTestId,
    );

    if (!flakyTest) {
      console.log("not found");
      throw ApiError.notFound("Flaky test not found in this test run");
    }
    console.log("flaky test found");

    if (flakyTest.status === "pending" || flakyTest.status === "fixed") {
      throw ApiError.conflict(
        `A fix has already been ${
          flakyTest.status === "pending"
            ? "applied and is awaiting review"
            : "merged"
        } for this test`,
      );
    }

    if (!flakyTest.flakyType || flakyTest.flakyType === "concurrency") {
      throw ApiError.unprocessable(
        "Automated fix is not available for this flaky type. Manual review required.",
      );
    }

    const repository = await Repository.findById(testRun.repositoryId);
    if (!repository) {
      throw ApiError.notFound("Repository not found");
    }

    console.log("repository  found");

    const user = await User.findById(userId).select("+githubAccessToken");
    if (!user || !user.githubAccessToken) {
      throw ApiError.unauthorized(
        "GitHub token not found. Please reconnect your GitHub account.",
      );
    }
   
    const trimmedTestName = flakyTest.name.trim();

    const { fixedCode, explanation } = RuleEngineService.applyFix({
      testCode: flakyTest.testCode,
      flakyType: flakyTest.flakyType as "async wait" | "network",
      framework: repository.framework,
      testName: trimmedTestName,
    });

    if (fixedCode === flakyTest.testCode) {
      throw ApiError.unprocessable(
        "No automated fix could be applied to this test. Manual review required.",
      );
    }

    const fixBranch = `fix/flaky-${sanitizeBranchName(flakyTest.name)}`;

    const relativeFilePath = flakyTest.file.replace(
      /^\/home\/runner\/work\/[^/]+\/[^/]+\//,
      "",
    );

    console.log("rfp", relativeFilePath);

    const { content: originalContent, sha: fileSha } =
      await GithubService.getFileContent(
        user.githubAccessToken,
        repository.fullName,
        relativeFilePath,
        repository.branch,
      );

    await GithubService.createBranch(
      user.githubAccessToken,
      repository.fullName,
      repository.branch,
      fixBranch,
    );

    await GithubService.commitFix(
      user.githubAccessToken,
      repository.fullName,
      relativeFilePath,
      originalContent,
      fixedCode,
      trimmedTestName,
      fixBranch,
      fileSha,
    );

    const { prNumber, prUrl } = await GithubService.openPullRequest(
      user.githubAccessToken,
      repository.fullName,
      repository.branch,
      fixBranch,
      trimmedTestName,
      explanation,
    );

    await TestRun.updateOne(
      {
        _id: testRunId,
        "flakyTests._id": new mongoose.Types.ObjectId(flakyTestId),
      },
      {
        $set: {
          "flakyTests.$.status": "pending",
          "flakyTests.$.prNumber": prNumber,
          "flakyTests.$.prUrl": prUrl,
          "flakyTests.$.explanation": explanation,
        },
      },
    );

    return { prNumber, prUrl, fixBranch };
  },
};
