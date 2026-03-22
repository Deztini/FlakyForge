import { createFileRoute } from "@tanstack/react-router";
import { Github, Star, Plus } from "lucide-react";

const repositories = [
  {
    name: "facebook/react",
    description: "The library for web and native user interfaces",
    language: "JavaScript",
    stars: "218k",
    lastScan: "2 hours ago",
    flakyTests: 8,
    fixedTests: 12,
    status: "active",
  },
  {
    name: "nodejs/node",
    description: "Node.js JavaScript runtime",
    language: "JavaScript",
    stars: "102k",
    lastScan: "5 hours ago",
    flakyTests: 15,
    fixedTests: 9,
    status: "active",
  },
  {
    name: "electron/electron",
    description: "Build cross-platform desktop apps",
    language: "TypeScript",
    stars: "112k",
    lastScan: "1 day ago",
    flakyTests: 6,
    fixedTests: 4,
    status: "active",
  },
  {
    name: "microsoft/vscode",
    description: "Visual Studio Code",
    language: "TypeScript",
    stars: "157k",
    lastScan: "3 hours ago",
    flakyTests: 12,
    fixedTests: 18,
    status: "active",
  },
  {
    name: "vercel/next.js",
    description: "The React Framework",
    language: "JavaScript",
    stars: "120k",
    lastScan: "30 minutes ago",
    flakyTests: 4,
    fixedTests: 7,
    status: "scanning",
  },
  {
    name: "angular/angular",
    description: "The modern web developer's platform",
    language: "TypeScript",
    stars: "94k",
    lastScan: "6 hours ago",
    flakyTests: 0,
    fixedTests: 5,
    status: "active",
  },
];

export const Route = createFileRoute("/_dashboard/repositories")({
  component: repositoryPage,
});

function repositoryPage() {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-[24px] font-semibold mb-1">
            Connected Repositories
          </h2>
          <p className="text-[#94A3B8] text-[14px]">
            Manage and monitor your GitHub repositories
          </p>
        </div>
        <button className="h-10 px-5 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[14px] font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Connect Repository
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">
            Total Repositories
          </div>
          <div className="text-white text-[32px] font-bold">6</div>
        </div>
        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Active Scans</div>
          <div className="text-white text-[32px] font-bold">1</div>
        </div>
        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">
            Total Flaky Tests
          </div>
          <div className="text-white text-[32px] font-bold">45</div>
        </div>
        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Total Fixed</div>
          <div className="text-white text-[32px] font-bold">55</div>
        </div>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        {repositories.map((repo) => (
          <div
            key={repo.name}
            className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6 hover:border-[#6C63FF]/50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6C63FF]/20 rounded-lg flex items-center justify-center">
                  <Github className="w-5 h-5 text-[#6C63FF]" />
                </div>
                <div>
                  <h3 className="text-white text-[15px] font-semibold">
                    {repo.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#94A3B8] text-[12px]">
                      {repo.language}
                    </span>
                    <span className="text-[#2D3148]">•</span>
                    <div className="flex items-center gap-1 text-[#94A3B8] text-[12px]">
                      <Star className="w-3 h-3" />
                      {repo.stars}
                    </div>
                  </div>
                </div>
              </div>
              {repo.status === "scanning" ? (
                <span className="px-2.5 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-[11px] font-semibold">
                  Scanning
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full text-[11px] font-semibold">
                  Active
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-[#94A3B8] text-[13px] mb-4">
              {repo.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#1E2139]">
              <div>
                <div className="text-[#94A3B8] text-[11px] mb-1">
                  Flaky Tests
                </div>
                <div className="text-[#EF4444] text-[18px] font-bold">
                  {repo.flakyTests}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8] text-[11px] mb-1">Fixed</div>
                <div className="text-[#22C55E] text-[18px] font-bold">
                  {repo.fixedTests}
                </div>
              </div>
              <div>
                <div className="text-[#94A3B8] text-[11px] mb-1">Last Scan</div>
                <div className="text-white text-[12px]">{repo.lastScan}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 h-9 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[13px] font-medium">
                Run Scan
              </button>
              <button className="flex-1 h-9 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
