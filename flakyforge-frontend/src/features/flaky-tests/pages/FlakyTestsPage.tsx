import { useState } from "react";
import { AuthGuard } from "../../../components/guards/AuthGuard";
import { useFlakyTests, useFlakyTestMetrics } from "../../../hooks/useFlakyTests";
import { FlakyTestsStatCards } from "../components/FlakyTestsStatCards";
import { FlakyTestsTable } from "../components/FlakyTestsTable/FlakyTestsTable";
import type { FlakyTestStatus } from "../../../api/flakyTestApi";

export function FlakyTestsPage() {
  const [activeFilter, setActiveFilter] = useState<FlakyTestStatus | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: metrics,
    isLoading: metricsLoading,
    isError: metricsError,
  } = useFlakyTestMetrics();

  const {
    data: flakyTestsData,
    isLoading: testsLoading,
    isError: testsError,
  } = useFlakyTests(currentPage, 10, activeFilter);


  function handleFilterChange(filter: FlakyTestStatus | undefined) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <FlakyTestsStatCards
          isLoading={metricsLoading}
          isError={metricsError}
          metrics={metrics}
        />

        <FlakyTestsTable
          isLoading={testsLoading}
          isError={testsError}
          data={flakyTestsData}
          metrics={metrics}
          actualCount={flakyTestsData?.flakyTests.length ?? 0}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onPageChange={setCurrentPage}
          
        />
      </div>
    </AuthGuard>
  );
}