import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { api } from "../../../lib/api";


export const Route = createFileRoute("/auth/github/callback")({

  component: GithubCallbackPage,
});

function GithubCallbackPage() {
  const { error } = Route.useSearch();
  console.log( error);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();


  useEffect(() => {
  const completeGithubAuth = async () => {
    if (error) {
      navigate({ to: "/login", search: { error: "GitHub login failed" } });
      return;
    }

    try {
      const { data } = await api.post("/auth/refresh");
      console.log(data);

      setAuth(data.data);

      navigate({ to: "/dashboard" });
    } catch {
      navigate({ to: "/login" });
    }
  };

  completeGithubAuth();
}, [error, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-10 pt-10 w-full max-w-105 text-center">
        <p className="text-amber-50">Completing GitHub sign-in…</p>
      </div>
    </div>
  );
}