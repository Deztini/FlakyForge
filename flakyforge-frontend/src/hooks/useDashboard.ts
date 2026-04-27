import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";


export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummary,
  });
};

export const useDashboardTrends = () => {
  return useQuery({
    queryKey: ["dashboard", "trends"],
    queryFn: dashboardApi.getTrends,
  });
};

export const useRootCauseBreakdown = () => {
  return useQuery({
    queryKey: ["dashboard", "root-cause"],
    queryFn: dashboardApi.getRootCauseBreakdown,
  });
};