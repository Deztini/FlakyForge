import { api } from "../lib/api";

export interface TestRun {
  _id: string;
  repoId: string;
  repoFullName: string;
  repoBranch: string;
  repoLanguage: string | null
  status: "pending" | "running" | "completed" | "failed";
  triggeredBy: "workflow_dispatch" | "push" | "pull_request" | "scheduled";
  commitSha?: string;
  duration?: number;
  flakyCount: number;
  totalTests: number;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface TestRunsResponse {
  testRuns: TestRun[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TestRunMetrics {
  totalRuns: number;
  runsToday: number;
  successRate: number;
  avgDuration: number;
}

export const testRunApi = {
  async getTestRuns(page: number, limit: number): Promise<TestRunsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const { data } = await api.get(`/test-runs?${params.toString()}`);
    return data.data;
  },

  async getMetrics(): Promise<TestRunMetrics> {
    const { data } = await api.get(`/test-runs/metrics`);
    return data.data;
  },
};
