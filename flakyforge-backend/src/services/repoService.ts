import axios from "axios";
import { IUser } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { Repository } from "../models/Repository";

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
};
