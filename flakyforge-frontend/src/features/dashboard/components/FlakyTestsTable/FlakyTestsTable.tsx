import { DashboardSectionLoader } from "../DashboardSectionLoader";
import { DashboardSectionError } from "../DashboardSectionError";
import { FlakyTestsFilters } from "./FlakyTestsFilters";
import { FlakyTestsPagination } from "./FlakyTestsPagination";
import { FlakyTestsRow } from "./FlakyTestsRows";

export function FlakyTestsTable({
  flakyTestsData,
  activeFilter,
  onFilterChange,
  currentPage,
  setCurrentPage,
  isLoading,
  isError,
}: any) {
  return (
    <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-[#1E2139]">
        <div>
          <h3 className="text-white text-[16px] font-semibold">Flaky Tests</h3>
          <p className="text-[#94A3B8] text-[13px]">
            Tests requiring attention across all repositories
          </p>
        </div>
        <FlakyTestsFilters
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>


        <table className="w-full">
          <thead className="bg-[#0F1117]">
            <tr>
              {[
                "Test Name",
                "Repository",
                "Cause",
                "Confidence",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className={`text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5 ${
                    h === "Test Name" || h === "Repository"
                      ? "text-left"
                      : "text-center"
                  } ${h === "Action" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>
                  <DashboardSectionLoader />
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={6}>
                  <DashboardSectionError message="Failed to load tests" />
                </td>
              </tr>
            )}

            {!isLoading && !isError && flakyTestsData && (
              <FlakyTestsRow flakyTestsData={flakyTestsData} />
            )}
          </tbody>
        </table>
    
      {flakyTestsData && (
        <FlakyTestsPagination
          flakyTestsData={flakyTestsData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
