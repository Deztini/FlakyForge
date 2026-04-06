import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { repoApi } from "../api/repoApi";
import type { ConnectRepoPayload } from "../api/repoApi";
import { isAxiosError } from "axios";

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
};

export const useConnectedRepos = () => {
  return useQuery({
    queryKey: ["repos", "connected"],
    queryFn: repoApi.getConnected,
  });
};

export const useAvailableRepos = (enabled: boolean) => {
  return useQuery({
    queryKey: ["repos", "available"],
    queryFn: repoApi.getAvailable,
    enabled,
  });
};

export const useConnectRepo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConnectRepoPayload) => repoApi.connect(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["repos", "connected"],
      });

      queryClient.invalidateQueries({
        queryKey: ["repos", "available"],
      });
    },

    onError: (error) => {
      console.error("[connect-repo error]", getErrorMessage(error));
    },
  });
};

export const useTriggerScan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repoId: string) => repoApi.triggerScan(repoId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repos", "connected"] });
    },

    onError: (error) => {
      console.error("[trigger-scan error]", getErrorMessage(error));
    },
  });
};

export { getErrorMessage };
