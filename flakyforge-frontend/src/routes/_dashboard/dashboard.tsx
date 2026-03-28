import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card } from "../../components/Card";
import { AuthGuard } from "../../components/guards/AuthGuard";

const lineChartData = [
  { day: "Mon", detected: 12, fixed: 8 },
  { day: "Tue", detected: 15, fixed: 10 },
  { day: "Wed", detected: 11, fixed: 9 },
  { day: "Thu", detected: 18, fixed: 14 },
  { day: "Fri", detected: 14, fixed: 11 },
  { day: "Sat", detected: 9, fixed: 7 },
  { day: "Sun", detected: 13, fixed: 10 },
];

const pieChartData = [
  { name: "Async Wait", value: 35, color: "#6C63FF" },
  { name: "Concurrency", value: 39, color: "#F59E0B" },
  { name: "Network", value: 26, color: "#3B82F6" },
];

const testData = [
  {
    testName: "should handle async timeout",
    fileName: "UserService.test.js",
    repository: "facebook/react",
    cause: "async wait",
    causeColor: "purple",
    confidence: "92%",
    confidenceColor: "green",
    status: "Fixed",
    statusColor: "green",
  },
  {
    testName: "parallel fetch collision",
    fileName: "DataFetcher.test.js",
    repository: "nodejs/node",
    cause: "concurrency",
    causeColor: "amber",
    confidence: "88%",
    confidenceColor: "green",
    status: "Fixed",
    statusColor: "green",
  },
  {
    testName: "network timeout on slow CI",
    fileName: "APIClient.test.js",
    repository: "electron/electron",
    cause: "network",
    causeColor: "blue",
    confidence: "76%",
    confidenceColor: "amber",
    status: "Pending",
    statusColor: "amber",
  },
  {
    testName: "race condition in worker",
    fileName: "WorkerPool.test.js",
    repository: "nodejs/node",
    cause: "concurrency",
    causeColor: "amber",
    confidence: "61%",
    confidenceColor: "red",
    status: "Unfixed",
    statusColor: "red",
  },
  {
    testName: "fetch mock not resetting",
    fileName: "MockService.test.js",
    repository: "facebook/react",
    cause: "network",
    causeColor: "blue",
    confidence: "83%",
    confidenceColor: "green",
    status: "Unfixed",
    statusColor: "red",
  },
];

const testStatistics = [
  {
    title: "Total Tests Scanned",
    value: "1,284",
    percentage: "+12% this week",
  },
  {
    title: "Flaky Tests Found",
    value: "47",
    percentage: "+3 new today",
  },
  {
    title: "Tests Fixed",
    value: "31",
    percentage: "66% fix rate",
  },
  {
    title: "Avg Confidence",
    value: "87%",
    percentage: "+2% vs last run",
  },
];

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: dashboardPage,
});

function dashboardPage() {
  const getCauseBadgeColors = (color: string) => {
    const colors = {
      purple: "bg-[#6C63FF]/20 text-[#6C63FF]",
      amber: "bg-[#F59E0B]/20 text-[#F59E0B]",
      blue: "bg-[#3B82F6]/20 text-[#3B82F6]",
    };
    return colors[color as keyof typeof colors];
  };

  const getConfidenceColor = (color: string) => {
    const colors = {
      green: "text-[#22C55E]",
      amber: "text-[#F59E0B]",
      red: "text-[#EF4444]",
    };
    return colors[color as keyof typeof colors];
  };

  const getStatusBadgeColors = (color: string) => {
    const colors = {
      green: "bg-[#22C55E]/20 text-[#22C55E]",
      amber: "bg-[#F59E0B]/20 text-[#F59E0B]",
      red: "bg-[#EF4444]/20 text-[#EF4444]",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <AuthGuard>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {testStatistics.map((ts) => (
          <Card className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
            <div className="text-[#94A3B8] text-[13px] mb-2">{ts.title}</div>
            <div className="text-white text-[32px] font-bold mb-2">
              {ts.value}
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-[12px]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{ts.percentage}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6">
          <h3 className="text-white text-[16px] font-semibold mb-4">
            Flaky Test Trends
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3148" />
              <XAxis
                dataKey="day"
                stroke="#94A3B8"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#94A3B8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1D27",
                  border: "1px solid #2D3148",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "13px" }} />
              <Line
                type="monotone"
                dataKey="detected"
                stroke="#6C63FF"
                strokeWidth={2}
                name="Detected"
              />
              <Line
                type="monotone"
                dataKey="fixed"
                stroke="#22C55E"
                strokeWidth={2}
                name="Fixed"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6">
          <h3 className="text-white text-[16px] font-semibold mb-4">
            Root Cause Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pieChartData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-white text-[13px]">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#94A3B8] text-[13px]">
                    {entry.value}%
                  </span>
                  <div className="w-12 h-1.5 bg-[#0F1117] rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        backgroundColor: entry.color,
                        width: `${entry.value}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-[#1E2139]">
          <div>
            <h3 className="text-white text-[16px] font-semibold">
              Flaky Tests
            </h3>
            <p className="text-[#94A3B8] text-[13px]">
              Tests requiring attention across all repositories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-7 px-3.5 bg-[#6C63FF] text-white rounded-full text-[13px]">
              All
            </button>
            <button className="h-7 px-3.5 bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] rounded-full text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
              Unfixed
            </button>
            <button className="h-7 px-3.5 bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] rounded-full text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
              Fixed
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0F1117]">
              <tr>
                <th className="text-left text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Test Name
                </th>
                <th className="text-left text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Repository
                </th>
                <th className="text-center text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Cause
                </th>
                <th className="text-center text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Confidence
                </th>
                <th className="text-center text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Status
                </th>
                <th className="text-right text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {testData.map((test, index) => (
                <tr
                  key={index}
                  className="border-b border-[#1E2139] hover:bg-[#1E2139] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="text-white text-[14px]">
                      {test.testName}
                    </div>
                    <div className="text-[#94A3B8] text-[12px]">
                      {test.fileName}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[#94A3B8] text-[13px]">
                    {test.repository}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] ${getCauseBadgeColors(test.causeColor)}`}
                    >
                      {test.cause}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3.5 text-center text-[14px] font-semibold ${getConfidenceColor(test.confidenceColor)}`}
                  >
                    {test.confidence}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] ${getStatusBadgeColors(test.statusColor)}`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {test.status === "Fixed" ? (
                      <button className="text-[#94A3B8] hover:text-white text-[13px] transition-colors">
                        View PR
                      </button>
                    ) : (
                      <button className="text-[#6C63FF] hover:text-[#5B52E8] text-[13px] font-medium transition-colors">
                        Apply Fix
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between border-t border-[#1E2139]">
          <div className="text-[#94A3B8] text-[13px]">
            Showing 5 of 47 flaky tests
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
              Previous
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
