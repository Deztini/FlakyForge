import { Github, Play, Brain, Wrench } from "lucide-react";
import { type ReactNode } from "react";

interface Step {
  number: number;
  icon: ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: <Github className="w-12 h-12 text-[#6C63FF] mx-auto mb-4" />,
    title: "Connect Repository",
    description:
      "Authenticate with GitHub and select the repository you want to analyze",
  },
  {
    number: 2,
    icon: <Play className="w-12 h-12 text-[#22C55E] mx-auto mb-4" />,
    title: "Run Test Suite",
    description:
      "FlakeSense injects a workflow that runs your tests multiple times to detect flaky behaviour",
  },
  {
    number: 3,
    icon: <Brain className="w-12 h-12 text-[#F59E0B] mx-auto mb-4" />,
    title: "AI Classification",
    description:
      "Our fine-tuned CodeBERT model classifies each flaky test as async, concurrency, or network",
  },
  {
    number: 4,
    icon: <Wrench className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />,
    title: "Auto Repair",
    description:
      "Rule-based repair engine applies targeted fixes and opens a pull request automatically",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-white text-[36px] font-bold mb-3">
            How FlakeForge Works
          </h2>
          <p className="text-[#94A3B8] text-[16px]">
            From repository to repaired test in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((st) => (
            <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-7">
              <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center mb-4">
                <span className="text-white text-[14px] font-semibold">
                  {st.number}
                </span>
              </div>
              {st.icon}
              <h3 className="text-white text-[16px] font-semibold mb-2 text-center">
                {st.title}
              </h3>
              <p className="text-[#94A3B8] text-[14px] text-center">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
