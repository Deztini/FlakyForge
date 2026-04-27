import { api } from "../lib/api";
const BASE_URL = import.meta.env.VITE_API_URL;


export interface DashboardSummary {
  totalTests: {
    value: number;
    change: number;
  };
  flakyTests: {
    value: number;
    change: number;
  };
  testsFixed: {
    value: number;
    change: number;
  };
  avgConfidence: {
    value: number;
    change: number;
  };
}

export interface TrendDay {
  day: string; 
  detected: number;
  fixed: number;
}

export interface RootCauseItem {
  type: "async wait" | "concurrency" | "network";
  count: number;
  percentage: number;
}

export interface RootCauseBreakdown {
  total: number;
  breakdown: RootCauseItem[];
}

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get(`${BASE_URL}/dashboard/summary`);
    return data.data;
  },

  async getTrends(): Promise<TrendDay[]> {
    const { data } = await api.get(`${BASE_URL}/dashboard/flaky-tests/trends`);
    return data.data.trends;
  },

  async getRootCauseBreakdown(): Promise<RootCauseBreakdown> {
    const { data } = await api.get(
      `${BASE_URL}/dashboard/flaky-tests/root-cause`
    );
    return data.data;
  },
};