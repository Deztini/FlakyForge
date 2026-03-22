import { createFileRoute } from "@tanstack/react-router";
import { Filter, Download, TrendingUp } from "lucide-react";

const flakyTests = [
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
    detectedDate: "2024-03-15",
    fixedDate: "2024-03-15",
    attempts: 12,
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
    detectedDate: "2024-03-14",
    fixedDate: "2024-03-14",
    attempts: 8,
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
    detectedDate: "2024-03-16",
    fixedDate: null,
    attempts: 15,
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
    detectedDate: "2024-03-17",
    fixedDate: null,
    attempts: 20,
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
    detectedDate: "2024-03-16",
    fixedDate: null,
    attempts: 10,
  },
  {
    testName: "promise rejection handling",
    fileName: "PromiseHandler.test.js",
    repository: "microsoft/vscode",
    cause: "async wait",
    causeColor: "purple",
    confidence: "95%",
    confidenceColor: "green",
    status: "Fixed",
    statusColor: "green",
    detectedDate: "2024-03-13",
    fixedDate: "2024-03-13",
    attempts: 6,
  },
  {
    testName: "concurrent state mutation",
    fileName: "StateManager.test.js",
    repository: "vercel/next.js",
    cause: "concurrency",
    causeColor: "amber",
    confidence: "78%",
    confidenceColor: "amber",
    status: "Pending",
    statusColor: "amber",
    detectedDate: "2024-03-17",
    fixedDate: null,
    attempts: 9,
  },
  {
    testName: "API retry logic failure",
    fileName: "RetryService.test.js",
    repository: "angular/angular",
    cause: "network",
    causeColor: "blue",
    confidence: "89%",
    confidenceColor: "green",
    status: "Fixed",
    statusColor: "green",
    detectedDate: "2024-03-12",
    fixedDate: "2024-03-12",
    attempts: 7,
  },
  {
    testName: "setTimeout cleanup issue",
    fileName: "TimerUtils.test.js",
    repository: "facebook/react",
    cause: "async wait",
    causeColor: "purple",
    confidence: "91%",
    confidenceColor: "green",
    status: "Unfixed",
    statusColor: "red",
    detectedDate: "2024-03-18",
    fixedDate: null,
    attempts: 11,
  },
  {
    testName: "WebSocket connection race",
    fileName: "WebSocketClient.test.js",
    repository: "electron/electron",
    cause: "network",
    causeColor: "blue",
    confidence: "85%",
    confidenceColor: "green",
    status: "Pending",
    statusColor: "amber",
    detectedDate: "2024-03-17",
    fixedDate: null,
    attempts: 13,
  },
  {
    testName: "database transaction rollback",
    fileName: "DBTransaction.test.js",
    repository: "nodejs/node",
    cause: "concurrency",
    causeColor: "amber",
    confidence: "72%",
    confidenceColor: "amber",
    status: "Unfixed",
    statusColor: "red",
    detectedDate: "2024-03-16",
    fixedDate: null,
    attempts: 18,
  },
  {
    testName: "event emitter order dependency",
    fileName: "EventEmitter.test.js",
    repository: "nodejs/node",
    cause: "async wait",
    causeColor: "purple",
    confidence: "87%",
    confidenceColor: "green",
    status: "Fixed",
    statusColor: "green",
    detectedDate: "2024-03-11",
    fixedDate: "2024-03-11",
    attempts: 5,
  },
];

export const Route = createFileRoute("/_dashboard/flaky-tests")({
  component: flakyTestPage,
});

function flakyTestPage() {
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
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">
            Total Flaky Tests
          </div>
          <div className="text-white text-[32px] font-bold mb-1">47</div>
          <div className="flex items-center gap-1 text-[#EF4444] text-[12px]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3 new today</span>
          </div>
        </div>

        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Fixed Tests</div>
          <div className="text-white text-[32px] font-bold mb-1">31</div>
          <div className="text-[#22C55E] text-[12px]">66% fix rate</div>
        </div>

        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Pending Fixes</div>
          <div className="text-white text-[32px] font-bold mb-1">4</div>
          <div className="text-[#F59E0B] text-[12px]">In progress</div>
        </div>

        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Unfixed Tests</div>
          <div className="text-white text-[32px] font-bold mb-1">12</div>
          <div className="text-[#EF4444] text-[12px]">Needs attention</div>
        </div>
      </div>

     
      <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-[#1E2139]">
          <div>
            <h3 className="text-white text-[16px] font-semibold">
              All Flaky Tests
            </h3>
            <p className="text-[#94A3B8] text-[13px]">
              Complete list of detected flaky tests across all repositories
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="h-9 px-4 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-[#1E2139] flex items-center gap-2">
          <button className="h-7 px-3.5 bg-[#6C63FF] text-white rounded-full text-[13px]">
            All ({flakyTests.length})
          </button>
          <button className="h-7 px-3.5 bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] rounded-full text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
            Unfixed (12)
          </button>
          <button className="h-7 px-3.5 bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] rounded-full text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
            Pending (4)
          </button>
          <button className="h-7 px-3.5 bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] rounded-full text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
            Fixed (31)
          </button>
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
                  Root Cause
                </th>
                <th className="text-center text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Confidence
                </th>
                <th className="text-center text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Attempts
                </th>
                <th className="text-center text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5">
                  Detected
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
              {flakyTests.map((test, index) => (
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
                  <td className="px-4 py-3.5 text-center text-[#94A3B8] text-[13px]">
                    {test.attempts}
                  </td>
                  <td className="px-4 py-3.5 text-center text-[#94A3B8] text-[13px]">
                    {test.detectedDate}
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
            Showing {flakyTests.length} of {flakyTests.length} flaky tests
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
    </div>
  );
}
