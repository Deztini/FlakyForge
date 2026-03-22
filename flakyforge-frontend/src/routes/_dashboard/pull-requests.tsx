import { createFileRoute } from "@tanstack/react-router";
import {
  GitPullRequest,
  GitMerge,
  ExternalLink,
  Clock,
  XCircle,
} from "lucide-react";

const pullRequests = [
  {
    id: "pr-2847",
    title: "Fix: Resolve async timeout in UserService.test.js",
    repository: "facebook/react",
    branch: "fix/async-timeout-userservice",
    author: "FlakeSense Bot",
    createdAt: "2024-03-18 14:45:00",
    status: "merged",
    statusColor: "purple",
    testName: "should handle async timeout",
    cause: "async wait",
    description:
      "Added proper wait conditions and increased timeout threshold to handle async operations.",
    additions: 12,
    deletions: 4,
    comments: 3,
    reviews: 2,
  },
  {
    id: "pr-2846",
    title: "Fix: Handle parallel fetch collision in DataFetcher.test.js",
    repository: "nodejs/node",
    branch: "fix/concurrency-datafetcher",
    author: "FlakeSense Bot",
    createdAt: "2024-03-18 13:28:15",
    status: "merged",
    statusColor: "purple",
    testName: "parallel fetch collision",
    cause: "concurrency",
    description:
      "Implemented proper locking mechanism to prevent race conditions in parallel requests.",
    additions: 18,
    deletions: 7,
    comments: 5,
    reviews: 3,
  },
  {
    id: "pr-2845",
    title: "Fix: Promise rejection handling in PromiseHandler.test.js",
    repository: "microsoft/vscode",
    branch: "fix/async-promise-handler",
    author: "FlakeSense Bot",
    createdAt: "2024-03-18 11:15:42",
    status: "open",
    statusColor: "green",
    testName: "promise rejection handling",
    cause: "async wait",
    description:
      "Added proper error boundary and rejection handlers for promise chains.",
    additions: 15,
    deletions: 5,
    comments: 1,
    reviews: 0,
  },
  {
    id: "pr-2844",
    title: "Fix: API retry logic failure in RetryService.test.js",
    repository: "angular/angular",
    branch: "fix/network-retry-service",
    author: "FlakeSense Bot",
    createdAt: "2024-03-17 16:52:33",
    status: "merged",
    statusColor: "purple",
    testName: "API retry logic failure",
    cause: "network",
    description:
      "Fixed network timeout handling and added exponential backoff for retry logic.",
    additions: 22,
    deletions: 9,
    comments: 7,
    reviews: 4,
  },
  {
    id: "pr-2843",
    title: "Fix: Event emitter order dependency",
    repository: "nodejs/node",
    branch: "fix/async-event-emitter",
    author: "FlakeSense Bot",
    createdAt: "2024-03-17 14:20:18",
    status: "merged",
    statusColor: "purple",
    testName: "event emitter order dependency",
    cause: "async wait",
    description:
      "Ensured event listeners are properly registered before emitting events.",
    additions: 10,
    deletions: 3,
    comments: 2,
    reviews: 2,
  },
  {
    id: "pr-2842",
    title: "Fix: Network timeout on slow CI in APIClient.test.js",
    repository: "electron/electron",
    branch: "fix/network-apiclient-timeout",
    author: "FlakeSense Bot",
    createdAt: "2024-03-17 10:35:27",
    status: "open",
    statusColor: "green",
    testName: "network timeout on slow CI",
    cause: "network",
    description:
      "Increased timeout values for CI environment and added retry logic.",
    additions: 14,
    deletions: 6,
    comments: 0,
    reviews: 1,
  },
  {
    id: "pr-2841",
    title: "Fix: Concurrent state mutation in StateManager.test.js",
    repository: "vercel/next.js",
    branch: "fix/concurrency-state-manager",
    author: "FlakeSense Bot",
    createdAt: "2024-03-16 18:42:55",
    status: "closed",
    statusColor: "red",
    testName: "concurrent state mutation",
    cause: "concurrency",
    description: "Added mutex locks to prevent concurrent state modifications.",
    additions: 20,
    deletions: 8,
    comments: 4,
    reviews: 2,
  },
  {
    id: "pr-2840",
    title: "Fix: WebSocket connection race in WebSocketClient.test.js",
    repository: "electron/electron",
    branch: "fix/network-websocket-race",
    author: "FlakeSense Bot",
    createdAt: "2024-03-16 15:18:12",
    status: "open",
    statusColor: "green",
    testName: "WebSocket connection race",
    cause: "network",
    description:
      "Implemented connection state management to handle race conditions.",
    additions: 16,
    deletions: 5,
    comments: 2,
    reviews: 1,
  },
];

export const Route = createFileRoute("/_dashboard/pull-requests")({
  component: pullRequestPage,
});

function pullRequestPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "merged":
        return <GitMerge className="w-4 h-4" />;
      case "open":
        return <GitPullRequest className="w-4 h-4" />;
      case "closed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadgeColors = (color: string) => {
    const colors = {
      purple: "bg-[#6C63FF]/20 text-[#6C63FF]",
      green: "bg-[#22C55E]/20 text-[#22C55E]",
      red: "bg-[#EF4444]/20 text-[#EF4444]",
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Total PRs</div>
          <div className="text-white text-[32px] font-bold">142</div>
        </div>

        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Merged</div>
          <div className="text-white text-[32px] font-bold mb-1">87</div>
          <div className="text-[#6C63FF] text-[12px]">61% merge rate</div>
        </div>

        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Open</div>
          <div className="text-white text-[32px] font-bold">43</div>
        </div>

        <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5">
          <div className="text-[#94A3B8] text-[13px] mb-2">Closed</div>
          <div className="text-white text-[32px] font-bold">12</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button className="h-9 px-4 bg-[#6C63FF] text-white rounded-lg text-[13px] font-medium">
          All PRs
        </button>
        <button className="h-9 px-4 bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium">
          Open
        </button>
        <button className="h-9 px-4 bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium">
          Merged
        </button>
        <button className="h-9 px-4 bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium">
          Closed
        </button>
      </div>

      {/* Pull Requests List */}
      <div className="space-y-3">
        {pullRequests.map((pr) => (
          <div
            key={pr.id}
            className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6 hover:border-[#6C63FF]/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBadgeColors(pr.statusColor)}`}
              >
                {getStatusIcon(pr.status)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white text-[15px] font-semibold mb-1">
                      {pr.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[#94A3B8] text-[13px]">
                      <span>{pr.repository}</span>
                      <span>•</span>
                      <span>#{pr.id}</span>
                      <span>•</span>
                      <span>Created {pr.createdAt}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-[#0F1117] rounded text-[11px]">
                        {pr.branch}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] capitalize ${getStatusBadgeColors(pr.statusColor)}`}
                  >
                    {getStatusIcon(pr.status)}
                    {pr.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[#94A3B8] text-[13px] mb-3">
                  {pr.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]"></div>
                    <span className="text-[#94A3B8] text-[12px]">
                      Root Cause: {pr.cause}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#22C55E] text-[12px]">
                      +{pr.additions}
                    </span>
                    <span className="text-[#EF4444] text-[12px]">
                      -{pr.deletions}
                    </span>
                  </div>
                  <div className="text-[#94A3B8] text-[12px]">
                    {pr.comments} comments
                  </div>
                  <div className="text-[#94A3B8] text-[12px]">
                    {pr.reviews} reviews
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="h-8 px-4 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[13px] font-medium flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    View on GitHub
                  </button>
                  <button className="h-8 px-4 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium">
                    View Test
                  </button>
                  <button className="h-8 px-4 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium">
                    View Diff
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-[#94A3B8] text-[13px]">
          Showing {pullRequests.length} of 142 pull requests
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
          <button className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
