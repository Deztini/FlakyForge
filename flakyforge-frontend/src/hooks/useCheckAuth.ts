import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useCheckAuth = () => {
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: ["auth", "check"],
    queryFn: authApi.checkAuth,

    staleTime: Infinity,

    retry: false,

    enabled: isAuthenticated
  });

  useEffect(() => {
    if (query.data) {
      setAuth(query.data);
    }
  }, [query.data, setAuth]);

  useEffect(() => {
    if (query.error) {
      clearAuth();
    }
  }, [query.error, clearAuth]);

  return query;
};