import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSignup } from "../../hooks/useAuth";
import { getErrorMessage } from "../../hooks/useAuth";
import { Logo } from "../Logo";
import { Input } from "../Input";
import { Button } from "../Button";
import { Github } from "lucide-react";

export function SignupForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Developer",
  });

  const signupMutation = useSignup();
  // const { login: githubLogin } = useGithubLogin();

  const errorMessage = signupMutation.error
    ? getErrorMessage(signupMutation.error)
    : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(form);
  };

  const githubLogin = () => {};

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4">
      <div className="w-full max-w-105">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <p className="text-[#94A3B8] text-sm">Create your account</p>
        </div>

        <div className="bg-[#1A1D27] border border-[#2D3148] rounded-2xl p-10">
          <h1 className="text-white text-xl font-semibold mb-1">
            Get started free
          </h1>
          <p className="text-[#94A3B8] text-sm mb-6">
            Create your account in seconds
          </p>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <div>
              <label className="text-[#94A3B8] text-sm mb-1 block">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full h-11 bg-[#0F1117] border border-[#2D3148] rounded-lg px-4 text-white focus:border-[#6C63FF] outline-none"
              >
                <option>Developer</option>
                <option>QA Engineer</option>
                <option>Team Lead</option>
                <option>Manager</option>
              </select>
            </div>
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              placeholder="••••••••"
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              name="confirm-password"
              type="password"
              value={form.password}
              placeholder="••••••••"
              onChange={handleChange}
            />

            <Button
              disabled={signupMutation.isPending}
              className="w-full h-11 bg-[#6C63FF] hover:bg-[#5B52E8] rounded-lg text-white font-medium"
            >
              {signupMutation.isPending
                ? "Creating account…"
                : "Create account"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#2D3148]" />
            <span className="text-[#94A3B8] text-xs">or</span>
            <div className="flex-1 h-px bg-[#2D3148]" />
          </div>

          <Button
            onClick={githubLogin}
            leftIcon={<Github size={18} />}
            className="w-full h-11 flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] border border-[#2D3148] rounded-lg text-white"
          >
            Sign up with GitHub
          </Button>

          <p className="text-center text-[#94A3B8] text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#6C63FF] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
