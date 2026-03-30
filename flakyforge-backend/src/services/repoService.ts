import axios from "axios";
import { IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { Repository } from "../models/Repository";
import { env } from "../config/env";

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
            url: `${env.BACKEND_URL}//webhooks/github`,
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
    });

    return repository;
  },
};
