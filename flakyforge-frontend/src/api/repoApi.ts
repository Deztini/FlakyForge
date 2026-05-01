import { api } from "../lib/api";
const BASE_URL = import.meta.env.VITE_API_URL;

export interface AvailableRepo {
  id: string;
  githubRepoId: number;
  fullName: string;
  language: string | null;
  stars: number;
  isPrivate: boolean;
  branch: string;
  description: string | null;
}

export interface AvailableRepoResponse {
  repos: AvailableRepo[]
}

export interface ConnectedRepo {
  id: string;
  userId: string;
  fullName: string;
  githubRepoId: number;
  language: string | null;
  stars: number;
  branch: string;
  scanTrigger: "push" | "pull_request" | "scheduled" | "workflow_dispatch";
  autoFixPRs: boolean;
  status: "active" | "scanning" | "error";
  flakyCount: number;
  fixedCount: number;
  lastScannedAt?: string;
  createdAt: string;
}

export interface ConnectedRepoResponse {
  repos: ConnectedRepo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ConnectRepoPayload {
  repoFullName: string;
  githubRepoId: number;
  language: string | null;
  stars: number;
  branch: string;
  scanTrigger: "push" | "pull_request" | "scheduled" | "workflow_dispatch";
  autoFixPRs: boolean;
}

export const repoApi = {
  async getAvailable(): Promise<AvailableRepoResponse> {
    const { data } = await api.get(`${BASE_URL}/repo/available`);
    return data.data;
  },

  async getConnected(
    page: number,
    limit: number,
  ): Promise<ConnectedRepoResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const { data } = await api.get(`${BASE_URL}/repo?${params.toString()}`);
    return data.data;
  },

  async connect(payload: ConnectRepoPayload): Promise<ConnectedRepo> {
    const { data } = await api.post(`${BASE_URL}/repo/connect`, payload);
    return data.data;
  },

  async triggerScan(repoId: string): Promise<void> {
    const { data } = await api.post(`${BASE_URL}/test-runs/${repoId}/trigger`);
    return data.data;
  },
};
