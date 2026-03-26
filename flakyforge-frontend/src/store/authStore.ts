import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../api/authApi";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        set({ user, accessToken, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      // Only persist the user object, not the token (it lives in localStorage separately)
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);