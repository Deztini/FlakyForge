import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { AuthGuard } from "../../../components/guards/AuthGuard";
import { usePullRequests, usePullRequestMetrics } from "../../../hooks/usePullRequest";
import { PullRequestStatCards } from "../components/PullRequestStatCards";
import { PullRequestCard } from "../components/PullRequestCard";
import { PullRequestPagination } from "../components/PullRequestPagination";
import { FILTER_TABS } from "../constants";
import type { PRState } from "../../../api/pullRequestApi";

export function PullRequestsPage() {
  const [activeFilter, setActiveFilter] = useState<PRState | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
  } = usePullRequestMetrics();

  const {
    data: pullRequestsData,
    isLoading: prsLoading,
    isError: prsError,
  } = usePullRequests(currentPage, 10, activeFilter);

  function handleFilterChange(filter: PRState | undefined) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <PullRequestStatCards
          isLoading={metricsLoading}
          isError={metricsError}
          metrics={metrics}
        />

        <div className="flex items-center gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleFilterChange(tab.value)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                activeFilter === tab.value
                  ? "bg-[#6C63FF] text-white"
                  : "text-[#94A3B8] hover:text-white border border-[#2D3148] hover:border-[#6C63FF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {prsLoading && (
          <div className="flex items-center justify-center py-48">
            <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin" />
          </div>
        )}

        {prsError && (
          <div className="flex items-center justify-center py-48 gap-3 text-[#EF4444]">
            <AlertCircle className="w-5 h-5" />
            <span className="text-[14px]">
              Failed to load pull requests. Please try again.
            </span>
          </div>
        )}

        {!prsLoading && !prsError && pullRequestsData && (
          <>
            {pullRequestsData.pullRequests.length === 0 ? (
              <div className="text-center text-[#94A3B8] text-[14px] py-48">
                No pull requests found.
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {pullRequestsData.pullRequests.map((pr) => (
                    <PullRequestCard key={pr.prNumber} pr={pr} />
                  ))}
                </div>

                <PullRequestPagination
                  pagination={pullRequestsData.pagination}
                  actualCount={pullRequestsData.pullRequests.length}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}