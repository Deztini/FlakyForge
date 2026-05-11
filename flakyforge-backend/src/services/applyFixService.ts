import mongoose from "mongoose";
import { TestRun } from "../models/TestRun";
import { Repository } from "../models/Repository";
import { User } from "../models/User";
import { RuleEngineService } from "./ruleEngineService";
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

    const flakyTest = testRun.flakyTests.find(
      (t) => t.id.toString() === flakyTestId,
    );

    if (!flakyTest) {
      throw ApiError.notFound("Flaky test not found in this test run");
    }

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
      throw ApiError.notFound(404, "Repository not found");
    }

    // .select("+githubToken") because the token is select: false on the User model
    const user = await User.findById(userId).select("+githubToken");
    if (!user || !user.githubToken) {
      throw new ApiError(
        401,
        "GitHub token not found. Please reconnect your GitHub account.",
      );
    }

    // Run the rule engine — pure in-memory, no external calls
    const { fixedCode, explanation } = RuleEngineService.applyFix({
      testCode: flakyTest.testCode,
      flakyType: flakyTest.flakyType as "async wait" | "network",
      framework: repository.framework as any,
      testName: flakyTest.name,
    });

    // If the rule engine produced no changes, there's nothing to PR
    if (fixedCode === flakyTest.testCode) {
      throw ApiError.unprocessable(
        "No automated fix could be applied to this test. Manual review required.",
      );
    }

    const fixBranch = `fix/flaky-${sanitizeBranchName(flakyTest.name)}`;

    // Fetch the current file from GitHub — we need the content and sha for the commit
    const { content: originalContent, sha: fileSha } =
      await GithubService.getFileContent(
        user.githubToken,
        repository.fullName,
        flakyTest.file,
        repository.branch,
      );

    // Create the fix branch off the repo's base branch
    await GithubService.createBranch(
      user.githubToken,
      repository.fullName,
      repository.branch,
      fixBranch,
    );

    // Splice the fix into the file and commit it to the fix branch
    await GithubService.commitFix(
      user.githubToken,
      repository.fullName,
      flakyTest.file,
      originalContent,
      fixedCode,
      flakyTest.name,
      fixBranch,
      fileSha,
    );

    // Open the pull request
    const { prNumber, prUrl } = await GithubService.openPullRequest(
      user.githubToken,
      repository.fullName,
      repository.branch,
      fixBranch,
      flakyTest.name,
      explanation,
    );

    // Update the flaky test status using MongoDB's positional $ operator
    // so we only touch the matching subdocument, not the whole array
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
        },
      },
    );

    return { prNumber, prUrl, fixBranch };
  },
};