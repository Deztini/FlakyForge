import { api } from "../lib/api";

export type PRState = "open" | "merged" | "closed";

export interface PullRequestItem {
  prNumber: number;
  prUrl: string;
  title: string;
  explanation: string;
  state: PRState;
  branch: string;
  createdAt: string;
  additions: number;
  deletions: number;
  repositoryName: string;
  flakyType?: "async wait" | "concurrency" | "network";
  testName: string;
}

export interface PullRequestsResponse {
  pullRequests: PullRequestItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PullRequestMetrics {
  total: number;
  breakdown: {
    open: number;
    merged: number;
    closed: number;
  };
}

export const pullRequestApi = {
  async getPullRequests(
    page: number,
    limit: number,
    state?: PRState,
  ): Promise<PullRequestsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (state) params.append("state", state);

    const { data } = await api.get(`/pull-requests?${params.toString()}`);
    return data.data;
  },

  async getMetrics(): Promise<PullRequestMetrics> {
    const { data } = await api.get(`/pull-requests/metrics`);
    return data.data;
  },
};
