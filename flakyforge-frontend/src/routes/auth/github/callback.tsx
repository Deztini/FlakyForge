import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";


type GithubCallbackSearch = {
  token?: string;
  error?: string;
};

export const Route = createFileRoute("/auth/github/callback")({
  validateSearch: (search: Record<string, unknown>): GithubCallbackSearch => ({
    token: search.token as string | undefined,
    error: search.error as string | undefined,
  }),
  component: GithubCallbackPage,
});

function GithubCallbackPage() {
  const { token, error } = Route.useSearch();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate({ to: "/login", search: { error: "GitHub login failed" } });
      return;
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAuth(
          { id: payload.userId, email: payload.email, name: payload.email, role: "Developer" },
          token,
        );
        navigate({ to: "/dashboard" });
      } catch {
        navigate({ to: "/login" });
      }
    }
  }, [token, error, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-10 pt-10 w-full max-w-105 text-center">
        <p className="text-amber-50">Completing GitHub sign-in…</p>
      </div>
    </div>
  );
}