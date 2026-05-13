import { api } from "../lib/api";

export type FlakyTestStatus = "unfixed" | "pending" | "fixed";

export interface FlakyTest {
  id: string;
  testRunId: string;
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

export interface ApplyFixResponse {
  prNumber: number;
  prUrl: string;
  fixBranch: string;
}

export interface ApplyFixInput {
  testRunId: string;
  flakyTestId: string;
}

export const flakyTestApi = {
  async getFlakyTests(
    page: number,
    limit: number,
    status?: FlakyTestStatus,
  ): Promise<FlakyTestsResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (status) params.append("status", status);

    const { data } = await api.get(
      `/flaky-tests?${params.toString()}`,
    );
    return data.data;
  },

  async getMetrics(): Promise<FlakyTestMetrics> {
    const { data } = await api.get(`/flaky-tests/metrics`);
    return data.data;
  },

  async applyFix(
    input: ApplyFixInput
  ): Promise<ApplyFixResponse> {
    const { data } = await api.post(`/flaky-tests/apply-fix`, input);
    return data.data;
  },
};
