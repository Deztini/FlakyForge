import { useState } from "react";
import {
  useDashboardSummary,
  useDashboardTrends,
  useRootCauseBreakdown,
} from "../../../hooks/useDashboard";
import { useFlakyTests } from "../../../hooks/useFlakyTests";
import type { FlakyTestStatus } from "../../../api/flakyTestApi";
import { SummaryCards } from "../components/SummaryCards";
import { TrendsChart } from "../components/TrendsChart";
import { RootCauseChart } from "../components/RootCauseChart";
import { FlakyTestsTable } from "../components/FlakyTestsTable/FlakyTestsTable";
import { AuthGuard } from "../../../components/guards/AuthGuard";

export function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<FlakyTestStatus | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useDashboardSummary();
  const {
    data: trends,
    isLoading: trendsLoading,
    isError: trendsError,
  } = useDashboardTrends();
  const {
    data: rootCause,
    isLoading: rootCauseLoading,
    isError: rootCauseError,
  } = useRootCauseBreakdown();
  const {
    data: flakyTestsData,
    isLoading: flakyTestsLoading,
    isError: flakyTestsError,
  } = useFlakyTests(currentPage, 5, activeFilter);

  function handleFilterChange(filter: FlakyTestStatus | undefined) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  return (
    <AuthGuard>
      <SummaryCards
        summary={summary}
        isLoading={summaryLoading}
        isError={summaryError}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <TrendsChart
          trends={trends}
          isLoading={trendsLoading}
          isError={trendsError}
        />

        <RootCauseChart
          rootCause={rootCause}
          isLoading={rootCauseLoading}
          isError={rootCauseError}
        />
      </div>

      <FlakyTestsTable
        data={flakyTestsData}
        isLoading={flakyTestsLoading}
        isError={flakyTestsError}
        activeFilter={activeFilter}
        actualCount={flakyTestsData?.flakyTests.length ?? 0}
        onFilterChange={handleFilterChange}
        onPageChange={setCurrentPage}
      />
    </AuthGuard>
  );
}
