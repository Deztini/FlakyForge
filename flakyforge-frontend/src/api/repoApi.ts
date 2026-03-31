import { api } from "../lib/api";
const BASE_URL = import.meta.env.VITE_API_URL;

export interface AvailableRepo {
  githubRepoId: number;
  fullName: string;
  language: string | null;
  stars: number;
  isPrivate: boolean;
  branch: string;
  description: string | null;
}

export interface ConnectedRepo {
  _id: string;
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
  async getAvailable(): Promise<AvailableRepo[]> {
    const { data } = await api.get(`${BASE_URL}/api/repo/available`);
    return data;
  },

  async getConnected(): Promise<ConnectedRepo[]> {
    const { data } = await api.get(`${BASE_URL}/api/repo`);
    return data;
  },

  async connect(payload: ConnectRepoPayload): Promise<ConnectedRepo> {
    const { data } = await api.post(`${BASE_URL}/api/repo/connect`, payload);
    return data;
  },
};
