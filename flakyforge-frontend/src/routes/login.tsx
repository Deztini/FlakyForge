import { createFileRoute } from '@tanstack/react-router'
import { Logo } from '../components/Logo';
import { Github, Lock } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: loginPage,
})

const handleEmailLogin = () => {}
const handleGithubLogin = () => {}

function loginPage() {
  return (
      <div className="min-h-screen w-full bg-[#0F1117] flex items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-[420px]">
        {/* Logo and Tagline */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <p className="text-[#94A3B8] text-[14px]">
            AI-powered flaky test detection and repair
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-[#1A1D27] rounded-2xl p-10 border border-[#2D3148]">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-white text-[20px] font-semibold mb-2">
              Connect with GitHub
            </h2>
            <p className="text-[#94A3B8] text-[14px]">
              Sign in to analyze your repositories
            </p>
          </div>

          {/* GitHub OAuth Button */}
          <button
            onClick={handleGithubLogin}
            className="w-full h-[52px] bg-[#6C63FF] hover:bg-[#5B52E8] transition-colors rounded-[10px] flex items-center justify-center gap-3 mb-6"
          >
            <Github className="w-5 h-5 text-white" />
            <span className="text-white text-[16px] font-medium">
              Continue with GitHub
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[1px] bg-[#2D3148]"></div>
            <span className="text-[#94A3B8] text-[13px]">or</span>
            <div className="flex-1 h-[1px] bg-[#2D3148]"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div>
              <label className="block text-[#94A3B8] text-[13px] mb-1.5 font-normal">
                Email address
              </label>
              <input
                type="email"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-[#0F1117] border border-[#2D3148] rounded-lg px-4 text-white text-[14px] focus:border-[#6C63FF] focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] text-[13px] mb-1.5 font-normal">
                Password
              </label>
              <input
                type="password"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-[#0F1117] border border-[#2D3148] rounded-lg px-4 text-white text-[14px] focus:border-[#6C63FF] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#6C63FF] hover:bg-[#5B52E8] transition-colors rounded-lg text-white text-[15px] font-medium mt-4"
            >
              Sign In
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-[#94A3B8] text-[13px] mt-5">
            Don't have an account?{' '}
            <a href="#" className="text-[#6C63FF] hover:underline">
              Get started free
            </a>
          </p>

          {/* Security note */}
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
