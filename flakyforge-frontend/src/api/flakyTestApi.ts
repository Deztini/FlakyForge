import { api } from "../lib/api";
const BASE_URL = import.meta.env.VITE_API_URL;

export type FlakyTestStatus = "unfixed" | "pending" | "fixed";

export interface FlakyTest {
  id: string;
  name: string;
  file: string;
  flakyType?: "async wait" | "concurrency" | "network";
  confidence?: number;
  runs: number;
  failRate: number;
  status: FlakyTestStatus;
  prUrl?: string;
  prNumber?: number;
  detected?: string;
  repositoryId: string;
  repositoryName: string;
}

export interface FlakyTestsResponse {
  flakyTests: FlakyTest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FlakyTestMetrics {
  total: number;
  breakdown: {
    fixed: number;
    pending: number;
    unfixed: number;
  };
  metrics: {
    fixRate: number;
    today: number;
  };
}

export const flakyTestApi = {
  async getFlakyTests(
    page: number,
    limit: number,
    status?: FlakyTestStatus
  ): Promise<FlakyTestsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (status) params.append("status", status);

    const { data } = await api.get(
      `${BASE_URL}/flaky-tests?${params.toString()}`
    );
    return data.data;
  },

  async getMetrics(): Promise<FlakyTestMetrics> {
    const { data } = await api.get(`${BASE_URL}/flaky-tests/metrics`);
    return data.data;
  },
};