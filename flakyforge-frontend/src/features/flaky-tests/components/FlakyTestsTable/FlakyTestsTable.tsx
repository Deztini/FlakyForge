import { Filter, Download } from "lucide-react";
import { Loader2, AlertCircle } from "lucide-react";
import type { FlakyTestStatus, FlakyTestsResponse, FlakyTestMetrics } from "../../../../api/flakyTestApi";
import { FlakyTestsFilters } from "./FlakyTestsFilters";
import { FlakyTestsRow } from "./FlakyTestsRow";
import { FlakyTestsPagination } from "./FlakyTestsPagination";


const TABLE_HEADERS = [
  { label: "Test Name", align: "text-left" },
  { label: "Repository", align: "text-left" },
  { label: "Root Cause", align: "text-center" },
  { label: "Confidence", align: "text-center" },
  { label: "Attempts", align: "text-center" },
  { label: "Detected", align: "text-center" },
  { label: "Status", align: "text-center" },
  { label: "Action", align: "text-right" },
];

type FlakyTestsTableProps = {
  isLoading: boolean;
  isError: boolean;
  data?: FlakyTestsResponse;
  metrics?: FlakyTestMetrics;
  activeFilter: FlakyTestStatus | undefined;
  onFilterChange: (filter: FlakyTestStatus | undefined) => void;
  onPageChange: (page: number) => void;
};

export function FlakyTestsTable({
  isLoading,
  isError,
  data,
  metrics,
  activeFilter,
  onFilterChange,
  onPageChange,
}: FlakyTestsTableProps) {
  return (
    <div className="bg-[#1A1D27] border border-[#1E2139] rounded-xl overflow-hidden mt-14">

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

      <FlakyTestsFilters
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        metrics={metrics}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0F1117]">
            <tr>
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h.label}
                  className={`text-[#94A3B8] text-[12px] font-semibold px-4 py-2.5 ${h.align}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8}>
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-[#6C63FF] animate-spin" />
                  </div>
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={8}>
                  <div className="flex items-center justify-center py-16 gap-2 text-[#EF4444]">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[13px]">Failed to load flaky tests.</span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !isError && data && (
              <FlakyTestsRow tests={data.flakyTests} />
            )}
          </tbody>
        </table>
      </div>

      {data && (
        <FlakyTestsPagination
          pagination={data.pagination}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}