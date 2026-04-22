import axios from "axios";
import crypto from "crypto";
import { IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { Repository } from "../models/Repository";
import { env } from "../config/env";
import { injectWorkflowFiles } from "../utils/injectWorflowFiles";
import { TestRun } from "../models/TestRun";
import { ClassifierService } from "./classifierService";

interface GitHubRepo {
  id: number;
  full_name: string;
  language: string | null;
  stargazers_count: number;
  private: boolean;
  default_branch: string;
  description: string | null;
}

export const RepoService = {
  async getAvailableRepos(user: IUser) {
    if (!user.githubAccessToken) {
      throw ApiError.badRequest(
        "No Github token found. Please logout and sign in with Github again",
      );
    }

    const { data } = await axios.get<GitHubRepo[]>(
      "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator",
      { headers: { Authorization: `Bearer ${user.githubAccessToken}` } },
    );

    const connected = await Repository.find({ userId: user._id }).select(
      "githubRepoId",
    );

    const connectedId = new Set(connected.map((r) => r.githubRepoId));

    return data
      .filter((r) => !connectedId.has(r.id))
      .map((r) => ({
        id: r.id,
        fullName: r.full_name,
        language: r.language,
        stars: r.stargazers_count,
        isPrivate: r.private,
        defaultBranch: r.default_branch,
        description: r.description,
      }));
  },

  async connectRepos(
    user: IUser,
    payload: {
      repoFullName: string;
      githubRepoId: number;
      language: string | null;
      stars: number;
      branch: string;
      scanTrigger: "push" | "pull_request" | "scheduled" | "workflow_dispatch";
      autoFixPRs: boolean;
    },
  ) {
    console.log(payload.repoFullName);
    if (!user.githubAccessToken) {
      throw ApiError.badRequest(
        "No Github token found. Please logout and sign in with Github again",
      );
    }

    const existing = await Repository.findOne({
      userId: user._id,
      githubRepoId: payload.githubRepoId,
    });

    if (existing) throw ApiError.badRequest("Repository is already connected");

    const [owner, repo] = payload.repoFullName.split("/");

    const webhookEvents = ["push", "pull_request", "check_run"];

    let webhookId: number | null = null;

    try {
      const webhookRes = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/hooks`,
        {
          owner,
          repo,
          name: "web",
          active: true,
          events: webhookEvents,
          config: {
            url: `${env.NGROK_URL}/webhooks/github`,
            content_type: "json",
            secret: env.WEBHOOK_SECRET,
          },
        },
        {
          headers: { Authorization: `Bearer ${user.githubAccessToken}` },
        },
      );
      webhookId = webhookRes.data.id;
    } catch (err: any) {
      if (err.response?.status !== 422) {
        throw ApiError.badRequest("Failed to install GitHub webhook");
      }
    }

    const apiKey = crypto.randomBytes(32).toString("hex");

    await injectWorkflowFiles(
      owner,
      repo,
      payload.branch,
      user.githubAccessToken,
      apiKey,
      env.BACKEND_URL,
    );

    const repository = await Repository.create({
      userId: user._id,
      fullName: payload.repoFullName,
      githubRepoId: payload.githubRepoId,
      language: payload.language,
      stars: payload.stars,
      branch: payload.branch,
      scanTrigger: payload.scanTrigger,
      autoFixPRs: payload.autoFixPRs,
      webhookId,
      flakyCount: 0,
      fixedCount: 0,
      apiKey,
    });

    return repository;
  },

  async getUserRepos(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [repos, total] = await Promise.all([
      Repository.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-apiKey"),
      Repository.countDocuments({ userId }),
    ]);
    return {
      repos,
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

  async triggerScan(repoId: string, user: IUser) {
    if (!user.githubAccessToken) {
      throw ApiError.badRequest(
        "No Github token found. Please logout and sign in with Github again",
      );
    }

    const repository = await Repository.findOne({
      _id: repoId,
      userId: user._id,
    });

    if (!repository) throw ApiError.notFound("No repository found");

    const [owner, repo] = repository.fullName.split("/");

    await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/flakeyradar.yml/dispatches`,
      {
        ref: repository.branch,
      },
      { headers: { Authorization: `Bearer ${user.githubAccessToken}` } },
    );

    const testRun = await TestRun.create({
      repositoryId: repository._id,
      userId: user._id,
      githubRepoId: repository.githubRepoId,
      status: "pending",
      triggeredBy: "workflow_dispatch",
      startedAt: new Date(),
    });

    await Repository.findByIdAndUpdate(repoId, { status: "scanning" });

    return testRun;
  },

  async collectResults(
    apiKey: string,
    payload: {
      githubRepoId: number;
      repoFullName: string;
      results: {
        id: string;
        name: string;
        failRate: number;
        file: string;
        testCode: string;
        runs: number;
        isFlaky: boolean;
      }[];
    },
  ) {
    const repository = await Repository.findOne({ apiKey });

    if (!repository) throw ApiError.unauthorized("Invalid API key");

    if (repository.githubRepoId !== payload.githubRepoId) {
      throw ApiError.badRequest("Repo ID mismatch");
    }

    const flakyTests = payload.results.filter((t) => t.isFlaky);
    const flakyCount = flakyTests.length;

    const totalRuns = payload.results.reduce((sum, t) => sum + t.runs, 0);
    const totalTests = payload.results.map((r) => r.name).length;

    const testRun = await TestRun.findOneAndUpdate(
      { repositoryId: repository._id, status: "pending" },
      {
        $set: {
          flakyCount,
          totalRuns,
          flakyTests: payload.results,
          completedAt: new Date(),
          status: "completed",
        },
      },
      {
        new: true,
        sort: { startedAt: -1 },
      },
    );

    if (!testRun)
      throw ApiError.notFound("No pending test run found for this repo");

    await Repository.findByIdAndUpdate(repository._id, {
      $set: {
        flakyCount,
        lastScannedAt: new Date(),
        status: "active",
      },
    });

    if (flakyTests.length > 0) {
      classifyAndUpdateTestRun(testRun._id.toString(), flakyTests);
    }

    return testRun;
  },

  async updateScanCounts(
    repoId: string,
    flakyCount: number,
    fixedCount: number,
  ) {
    return Repository.findByIdAndUpdate(
      repoId,
      {
        $set: {
          flakyCount,
          fixedCount,
          lastScannedAt: new Date(),
          status: "active",
        },
      },
      { new: true },
    );
  },
};

async function classifyAndUpdateTestRun(
  testRunId: string,
  flakyTests: { id: string; testCode: string; [key: string]: any }[],
) {
  try {
    console.log(`Classifying ${flakyTests.length} flaky tests...`);

    const classificationMap = await ClassifierService.classifyFlakyTests(
      flakyTests.map((t) => ({ id: t.id, testCode: t.testCode })),
    );

    console.log(classificationMap);

    const updatedFlakyTests = flakyTests.map((test) => {
      const classification = classificationMap.get(test.id);
      return {
        ...test,
        flakyType: classification?.label,
        confidence: classification?.confidence,
      };
    });

    await TestRun.findByIdAndUpdate(testRunId, {
      $set: { flakyTests: updatedFlakyTests },
    });

    console.log(`Classification complete for test run ${testRunId}`);
  } catch (err) {
    console.error("Background classification failed:", err);
  }
}
