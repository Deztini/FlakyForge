import { Check, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[#1A1D27] border border-[#6C63FF] rounded-full px-4 py-1.5 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#6C63FF]" />
          <span className="text-[#6C63FF] text-[13px]">
            Powered by CodeBERT + LoRA
          </span>
        </div>

        <h1 className="text-white text-[56px] font-bold leading-[1.15] mb-6">
          Detect and Fix Flaky Tests
          <br />
          Automatically
        </h1>

        <p className="text-[#94A3B8] text-[18px] max-w-2xl mx-auto mb-8">
          FlakeyRadar uses fine-tuned AI to classify the root cause of flaky
          tests - async, concurrency, or network - and applies intelligent
          repairs in minutes.
        </p>

        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            // onClick={() => navigate('/dashboard')}
            className="h-12 px-7 bg-[#6C63FF] text-white rounded-[10px] hover:bg-[#5B52E8] transition-colors text-[15px] font-medium"
          >
            Connect GitHub Repo
          </button>
          <button className="h-12 px-7 border border-[#2D3148] text-[#94A3B8] rounded-[10px] hover:border-[#6C63FF] hover:text-white transition-colors text-[15px] font-medium">
            View Demo
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-[#94A3B8] text-[13px]">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#22C55E]" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#22C55E]" />
            <span>Free for open source</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#22C55E]" />
            <span>Results in under 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
