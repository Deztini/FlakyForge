import type { FlakyTestStatus } from "../../../../api/flakyTestApi";
import { FILTER_TABS } from "../../constants";

type FlakyTestsFiltersProps = {
  activeFilter: FlakyTestStatus | undefined;
  metrics?: {
    total: number;
    breakdown: { fixed: number; pending: number; unfixed: number };
  };
  onFilterChange: (filter: FlakyTestStatus | undefined) => void;
};

export function FlakyTestsFilters({
  activeFilter,
  metrics,
  onFilterChange,
}: FlakyTestsFiltersProps) {
  function getCount(value: FlakyTestStatus | undefined): number | null {
    if (!metrics) return null;
    if (value === undefined) return metrics.total;
    if (value === "unfixed") return metrics.breakdown.unfixed;
    if (value === "pending") return metrics.breakdown.pending;
    if (value === "fixed") return metrics.breakdown.fixed;
    return null;
  }

  return (
    <div className="px-6 py-4 border-b border-[#1E2139] flex items-center gap-2">
      {FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab.value;
        const count = getCount(tab.value);

        return (
          <button
            key={tab.label}
            onClick={() => onFilterChange(tab.value)}
            className={`h-7 px-3.5 rounded-full text-[13px] transition-colors ${
              isActive
                ? "bg-[#6C63FF] text-white"
                : "bg-[#0F1117] border border-[#2D3148] text-[#94A3B8] hover:border-[#6C63FF] hover:text-white"
            }`}
          >
            {tab.label}
            {count !== null ? ` (${count})` : ""}
          </button>
        );
      })}
    </div>
  );
}
