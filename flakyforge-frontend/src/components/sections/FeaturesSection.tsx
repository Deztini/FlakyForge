import {
  Target,
  Zap,
  Github,
  BarChart3,
  GitPullRequest,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Target,
    iconColor: "text-[#6C63FF]",
    bgColor: "bg-[#6C63FF]/20",
    title: "Smart Classification",
    description:
      "Classifies root cause into async, concurrency, or network using AI trained on real commits",
  },
  {
    icon: Zap,
    iconColor: "text-[#22C55E]",
    bgColor: "bg-[#22C55E]/20",
    title: "Auto Repair",
    description: "Applies targeted AST-based code fixes depending on the detected cause",
  },
  {
    icon: Github,
    iconColor: "text-[#F59E0B]",
    bgColor: "bg-[#F59E0B]/20",
    title: "GitHub Integration",
    description:
      "Seamless OAuth connection and workflow injection into any JavaScript repository",
  },
  {
    icon: BarChart3,
    iconColor: "text-[#3B82F6]",
    bgColor: "bg-[#3B82F6]/20",
    title: "Confidence Scores",
    description:
      "Every prediction comes with a probability score so you know how certain the model is",
  },
  {
    icon: GitPullRequest,
    iconColor: "text-[#EF4444]",
    bgColor: "bg-[#EF4444]/20",
    title: "PR Generation",
    description:
      "Automatically opens a pull request with the fix applied and full explanation",
  },
  {
    icon: AlertCircle,
    iconColor: "text-[#06B6D4]",
    bgColor: "bg-[#06B6D4]/20",
    title: "Live Dashboard",
    description:
      "Track all flaky tests, fix status, and trends across all connected repositories",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-[#0A0D14]/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-[36px] font-bold mb-12">Everything you need</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6"
              >
                <div
                  className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-white text-[15px] font-semibold mb-2">{feature.title}</h3>
                <p className="text-[#94A3B8] text-[14px]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}