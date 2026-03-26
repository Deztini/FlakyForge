import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
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

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      router.navigate({
        to: "/verify-otp",
        search: { email: data.email },
      });
    },
    onError: (error) => {
      console.error("[signup error]", getErrorMessage(error));
    },
  });
};

export const useVerifyOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: () => {
      router.navigate({ to: "/login" });
    },
    onError: (error) => {
      console.error("[verify-otp error]", getErrorMessage(error));
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.resendOtp(email),
    onError: (error) => {
      console.error("[resend-otp error]", getErrorMessage(error));
    },
  });
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      console.error("[login error]", getErrorMessage(error));
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      router.navigate({ to: "/login" });
    },
    onError: () => {
      clearAuth();
      router.navigate({ to: "/login" });
    },
  });
};

export const useGithubLogin = () => {
  return {
    login: authApi.githubLogin,
  };
};

export { getErrorMessage };