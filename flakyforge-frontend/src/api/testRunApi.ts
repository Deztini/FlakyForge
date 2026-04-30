import { api } from "../lib/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface TestRun {
  id: string;
  repositoryId: {
    id: string;
    fullName: string;
    branch: string;
    language: string | null;
  };
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

    const { data } = await api.get(
      `${BASE_URL}/test-runs?${params.toString()}`,
    );
    return data.data;
  },

  async getMetrics(): Promise<TestRunMetrics> {
    const { data } = await api.get(`${BASE_URL}/test-runs/metrics`);
    return data.data;
  },
};
