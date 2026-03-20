import { Logo } from "../Logo";

export function Navbar() {
  return (
    <nav className="w-full h-16 bg-[#0F1117] border-b border-[#1E2139] px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <Logo size="sm" />

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-[#94A3B8] hover:text-white transition-colors text-[14px]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[#94A3B8] hover:text-white transition-colors text-[14px]"
          >
            How it works
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            // onClick={() => navigate('/login')}
            className="h-9 px-5 border border-[#6C63FF] text-[#6C63FF] rounded-lg hover:bg-[#6C63FF]/10 transition-colors text-[14px] font-medium"
          >
            Sign In
          </button>
          <button
            // onClick={() => navigate('/dashboard')}
            className="h-9 px-5 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[14px] font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
