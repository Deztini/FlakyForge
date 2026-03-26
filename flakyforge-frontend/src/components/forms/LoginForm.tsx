import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Logo } from "../Logo";
import { Github, Lock } from "lucide-react";
import { useLogin } from "../../hooks/useAuth";
import { getErrorMessage } from "../../hooks/useAuth";
import { Link } from "@tanstack/react-router";


export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();

  const errorMessage = loginMutation.error
    ? getErrorMessage(loginMutation.error)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleGithubLogin = () => {};

  return (
    <div className="min-h-screen w-full bg-[#0F1117] flex items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-100">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <p className="text-[#94A3B8] text-[14px]">
            AI-powered flaky test detection and repair
          </p>
        </div>

        <div className="w-full bg-[#1A1D27] rounded-2xl p-10 border border-[#2D3148]">
          <div className="text-center mb-6">
            <h2 className="text-white text-[20px] font-semibold mb-2">
              Connect with GitHub
            </h2>
            <p className="text-[#94A3B8] text-[14px]">
              Sign in to analyze your repositories
            </p>
          </div>

          <Button
            handleClick={handleGithubLogin}
            leftIcon={<Github className="w-5 h-5 text-white" />}
            className="w-full h-13 bg-[#6C63FF] hover:bg-[#5B52E8] transition-colors rounded-[10px] flex items-center justify-center gap-3 mb-6"
          >
            <span className="text-white text-[16px] font-medium">
              Continue with GitHub
            </span>
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#2D3148]"></div>
            <span className="text-[#94A3B8] text-[13px]">or</span>
            <div className="flex-1 h-px bg-[#2D3148]"></div>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#6C63FF] hover:bg-[#5B52E8] transition-colors rounded-lg text-white text-[15px] font-medium mt-4"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-[#94A3B8] text-[13px] mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#6C63FF] hover:underline">
              Get started free
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-[#2D3148]">
            <p className="text-center text-[#94A3B8] text-[12px] flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              We only request read access to your repositories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
