import type { ConnectedRepoResponse } from "../../../api/repoApi";
import { Button } from "../../../components/Button";

type RepoPaginationProps = {
  pagination: ConnectedRepoResponse["pagination"];
  actualCount: number;
  onPageChange: (page: number) => void;
};

export function RepoPagination({
  pagination,
  actualCount,
  onPageChange,
}: RepoPaginationProps) {
  const pages = Array.from(
    { length: Math.min(pagination.totalPages, 3) },
    (_, i) => {
      const start = Math.max(
        1,
        Math.min(pagination.page - 1, pagination.totalPages - 2),
      );
      return start + i;
    },
  );

  return (
    <div className="flex items-center justify-between">
      <div className="text-[#94A3B8] text-[13px]">
        Showing {actualCount} of {pagination.total} connected repos
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={!pagination.hasPrev}
          onClick={() => onPageChange(pagination.page - 1)}
          className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </Button>

        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`h-8 w-8 rounded-lg text-[13px] transition-colors ${
              pageNum === pagination.page
                ? "bg-[#6C63FF] text-white"
                : "border border-[#2D3148] text-[#94A3B8] hover:border-[#6C63FF] hover:text-white"
            }`}
          >
            {pageNum}
          </button>
        ))}

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
