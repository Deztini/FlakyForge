import { api } from "../lib/api";

export interface SignupInput {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyOtpInput {
  email: string;
  code: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: AuthUser;
}

export interface SignupResponse {
  message: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export const authApi = {
  signup: async (input: SignupInput): Promise<SignupResponse> => {
    const { data } = await api.post<SignupResponse>("/auth/signup", input);
    return data;
  },

  verifyOtp: async (input: VerifyOtpInput): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/verify-otp", input);
    return data;
  },

  resendOtp: async (email: string): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/resend-otp", {
      email,
    });
    return data;
  },

  login: async (input: LoginInput): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", input);
    return data;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const { data } = await api.post<RefreshResponse>("/auth/refresh");
    return data;
  },

  logout: async (): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/logout");
    return data;
  },

  githubLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  },
};
