import { useQuery } from "@tanstack/react-query";
import { testRunApi } from "../api/testRunApi";

export const useTestRuns = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["test-runs", page, limit],
    queryFn: () => testRunApi.getTestRuns(page, limit),
  });
};

export const useTestRunMetrics = () => {
  return useQuery({
    queryKey: ["test-runs", "metrics"],
    queryFn: testRunApi.getMetrics,
  });
};