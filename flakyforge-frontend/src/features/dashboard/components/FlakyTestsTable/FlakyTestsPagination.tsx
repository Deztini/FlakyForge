import type { FlakyTestsResponse } from "../../../../api/flakyTestApi";
import { Button } from "../../../../components/Button";

type FlakyTestsPaginationProps = {
  pagination: FlakyTestsResponse["pagination"];
  actualCount: number;
  onPageChange: (page: number) => void;
};

export function FlakyTestsPagination({
  pagination,
  actualCount,
  onPageChange,
}: FlakyTestsPaginationProps) {
  return (
    <div className="p-4 flex items-center justify-between border-t border-[#1E2139]">
      <div className="text-[#94A3B8] text-[13px]">
        Showing {actualCount} of {pagination.total} flaky tests
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={!pagination.hasPrev}
          onClick={() => onPageChange(pagination.page - 1)}
          className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        <Button
          disabled={!pagination.hasNext}
          onClick={() => onPageChange(pagination.page + 1)}
          className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
