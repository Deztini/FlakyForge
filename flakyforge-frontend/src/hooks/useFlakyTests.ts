import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flakyTestApi } from "../api/flakyTestApi";
import type { ApplyFixInput, FlakyTestStatus } from "../api/flakyTestApi";
import { getErrorMessage } from "./useRepos";

export const useFlakyTests = (
  page: number,
  limit: number,
  status?: FlakyTestStatus,
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

export const useApplyFix = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApplyFixInput) => flakyTestApi.applyFix(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flaky-tests"] });
    },
    onError: (error) => {
      console.error("[apply-fix error]", getErrorMessage(error));
    },
  });
};
