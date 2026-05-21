import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { AuthGuard } from "../../../components/guards/AuthGuard";
import { useTestRuns, useTestRunMetrics } from "../../../hooks/useTestRuns";
import { TestRunsStatCards } from "../components/TestRunsStatCards";
import { TestRunCard } from "../components/TestRunCard";
import { TestRunsPagination } from "../components/TestRunsPagination";

export function TestRunsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
  } = useTestRunMetrics();

  const {
    data: testRunsData,
    isLoading: runsLoading,
    isError: runsError,
  } = useTestRuns(currentPage, 10);

  return (
    <AuthGuard>
      <div className="space-y-6">
        <TestRunsStatCards
          isLoading={metricsLoading}
          isError={metricsError}
          metrics={metrics}
        />

        {runsLoading && (
          <div className="flex items-center justify-center py-48">
            <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin" />
          </div>
        )}

        {runsError && (
          <div className="flex items-center justify-center py-48 gap-3 text-[#EF4444]">
            <AlertCircle className="w-5 h-5" />
            <span className="text-[14px]">
              Failed to load test runs. Please try again.
            </span>
          </div>
        )}

        {!runsLoading && !runsError && testRunsData && (
          <>
            {testRunsData.testRuns.length === 0 ? (
              <div className="text-center text-[#94A3B8] text-[14px] py-48">
                No test runs found.
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {testRunsData.testRuns.map((run) => (
                    <TestRunCard key={run._id} run={run} />
                  ))}
                </div>

                <TestRunsPagination
                  pagination={testRunsData.pagination}
                  actualCount={testRunsData.testRuns.length}
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
