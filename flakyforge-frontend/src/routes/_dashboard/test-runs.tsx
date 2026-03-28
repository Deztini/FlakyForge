import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { Card } from "../../components/Card";
import { AuthGuard } from "../../components/guards/AuthGuard";

const testRuns = [
  {
    id: "run-847392",
    repository: "facebook/react",
    branch: "main",
    commit: "a3f9b2c",
    commitMessage: "Fix render issue in suspense",
    triggeredBy: "GitHub Workflow",
    startTime: "2024-03-18 14:32:15",
    duration: "3m 42s",
    totalTests: 1284,
    passed: 1237,
    failed: 0,
    flaky: 8,
    status: "completed",
    statusColor: "green",
  },
  {
    id: "run-847391",
    repository: "nodejs/node",
    branch: "main",
    commit: "b7e1d4f",
    commitMessage: "Update async_hooks implementation",
    triggeredBy: "Manual",
    startTime: "2024-03-18 13:15:08",
    duration: "5m 18s",
    totalTests: 2156,
    passed: 2126,
    failed: 0,
    flaky: 15,
    status: "completed",
    statusColor: "green",
  },
  {
    id: "run-847390",
    repository: "vercel/next.js",
    branch: "canary",
    commit: "c9d2a1e",
    commitMessage: "Add support for React 19",
    triggeredBy: "GitHub Workflow",
    startTime: "2024-03-18 12:48:33",
    duration: "2m 15s",
    totalTests: 856,
    passed: 852,
    failed: 0,
    flaky: 4,
    status: "running",
    statusColor: "blue",
  },
  {
    id: "run-847389",
    repository: "electron/electron",
    branch: "main",
    commit: "d4f8c7a",
    commitMessage: "Upgrade chromium version",
    triggeredBy: "Scheduled",
    startTime: "2024-03-18 11:20:45",
    duration: "4m 52s",
    totalTests: 1642,
    passed: 1636,
    failed: 0,
    flaky: 6,
    status: "completed",
    statusColor: "green",
  },
  {
    id: "run-847388",
    repository: "microsoft/vscode",
    branch: "main",
    commit: "e2b9f3d",
    commitMessage: "Improve extension host startup",
    triggeredBy: "Manual",
    startTime: "2024-03-18 10:05:12",
    duration: "6m 33s",
    totalTests: 2847,
    passed: 2823,
    failed: 0,
    flaky: 12,
    status: "completed",
    statusColor: "green",
  },
  {
    id: "run-847387",
    repository: "angular/angular",
    branch: "main",
    commit: "f1c4e8b",
    commitMessage: "Optimize change detection",
    triggeredBy: "GitHub Workflow",
    startTime: "2024-03-18 09:42:27",
    duration: "4m 08s",
    totalTests: 1523,
    passed: 1523,
    failed: 0,
    flaky: 0,
    status: "completed",
    statusColor: "green",
  },
  {
    id: "run-847386",
    repository: "facebook/react",
    branch: "main",
    commit: "g8d1b5f",
    commitMessage: "Update hooks documentation",
    triggeredBy: "GitHub Workflow",
    startTime: "2024-03-17 18:15:52",
    duration: "3m 28s",
    totalTests: 1284,
    passed: 1276,
    failed: 0,
    flaky: 8,
    status: "completed",
    statusColor: "green",
  },
  {
    id: "run-847385",
    repository: "nodejs/node",
    branch: "v20.x",
    commit: "h3a7f2c",
    commitMessage: "Backport security fixes",
    triggeredBy: "Manual",
    startTime: "2024-03-17 16:32:18",
    duration: "5m 45s",
    totalTests: 2156,
    passed: 2141,
    failed: 0,
    flaky: 15,
    status: "failed",
    statusColor: "red",
  },
];

const testRunStatistics = [
  { title: "Total Runs", value: "857" },
  { title: "Runs Today", value: "12" },
  { title: "Success Rate", value: "85%" },
  { title: "Avg Duration", value: "4m 12s" },
];

export const Route = createFileRoute("/_dashboard/test-runs")({
  component: testRunPage,
});

function testRunPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "running":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadgeColors = (color: string) => {
    const colors = {
      green: "bg-[#22C55E]/20 text-[#22C55E]",
      blue: "bg-[#3B82F6]/20 text-[#3B82F6]",
      red: "bg-[#EF4444]/20 text-[#EF4444]",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {testRunStatistics.map((ts) => (
            <Card className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
              <div className="text-[#94A3B8] text-[13px] mb-2">{ts.title}</div>
              <div className="text-white text-[32px] font-bold">{ts.value}</div>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          {testRuns.map((run) => (
            <Card
              key={run.id}
              className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6 hover:border-[#6C63FF]/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white text-[16px] font-semibold">
                      {run.repository}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-[#0F1117] border border-[#2D3148] rounded-full text-[#94A3B8] text-[11px]">
                      {run.branch}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] capitalize ${getStatusBadgeColors(run.statusColor)}`}
                    >
                      {getStatusIcon(run.status)}
                      {run.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#94A3B8] text-[13px]">
                    <span>Run ID: {run.id}</span>
                    <span>•</span>
                    <span>Commit: {run.commit}</span>
                    <span>•</span>
                    <span>{run.commitMessage}</span>
                  </div>
                </div>
                <button className="h-9 px-4 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium">
                  View Details
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-4 border-t border-[#1E2139]">
                <div>
                  <div className="text-[#94A3B8] text-[11px] mb-1">
                    Triggered By
                  </div>
                  <div className="text-white text-[13px]">
                    {run.triggeredBy}
                  </div>
                </div>
                <div>
                  <div className="text-[#94A3B8] text-[11px] mb-1">Started</div>
                  <div className="text-white text-[13px]">{run.startTime}</div>
                </div>
                <div>
                  <div className="text-[#94A3B8] text-[11px] mb-1">
                    Duration
                  </div>
                  <div className="text-white text-[13px]">{run.duration}</div>
                </div>
                <div>
                  <div className="text-[#94A3B8] text-[11px] mb-1">
                    Total Tests
                  </div>
                  <div className="text-white text-[13px]">
                    {run.totalTests.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[#94A3B8] text-[11px] mb-1">Passed</div>
                  <div className="text-[#22C55E] text-[13px] font-semibold">
                    {run.passed.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[#94A3B8] text-[11px] mb-1">Flaky</div>
                  <div className="text-[#F59E0B] text-[13px] font-semibold">
                    {run.flaky}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[#94A3B8] text-[13px]">
            Showing {testRuns.length} of 847 test runs
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
              Previous
            </button>
            <button className="h-8 w-8 bg-[#6C63FF] text-white rounded-lg text-[13px]">
              1
            </button>
            <button className="h-8 w-8 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
              2
            </button>
            <button className="h-8 w-8 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
              3
            </button>
            <button className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
