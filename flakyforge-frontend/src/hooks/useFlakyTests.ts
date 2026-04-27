import { useQuery } from "@tanstack/react-query";
import { flakyTestApi } from "../api/flakyTestApi";
import type { FlakyTestStatus } from "../api/flakyTestApi";

export const useFlakyTests = (
  page: number,
  limit: number,
  status?: FlakyTestStatus
) => {
  return useQuery({
    queryKey: ["flaky-tests", page, limit, status ?? "all"],
    queryFn: () => flakyTestApi.getFlakyTests(page, limit, status),
  });
};

export const useFlakyTestMetrics = () => {
  return useQuery({
    queryKey: ["flaky-tests", "metrics"],
    queryFn: flakyTestApi.getMetrics,
  });
};