import { useQuery } from "@tanstack/react-query";
import { pullRequestApi } from "../api/pullRequestApi";
import type { PRState } from "../api/pullRequestApi";

export const usePullRequests = (
  page: number,
  limit: number,
  state?: PRState
) => {
  return useQuery({
    queryKey: ["pull-requests", page, limit, state ?? "all"],
    queryFn: () => pullRequestApi.getPullRequests(page, limit, state),
  });
};

export const usePullRequestMetrics = () => {
  return useQuery({
    queryKey: ["pull-requests", "metrics"],
    queryFn: pullRequestApi.getMetrics,
  });
};