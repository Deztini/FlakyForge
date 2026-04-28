export function FlakyTestsPagination({ flakyTestsData, setCurrentPage }: any) {
  return (
      <div className="p-4 flex items-center justify-between border-t border-[#1E2139]">
              <div className="text-[#94A3B8] text-[13px]">
                Showing {flakyTestsData.flakyTests.length} of{" "}
                {flakyTestsData.pagination.total} flaky tests
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={!flakyTestsData.pagination.hasPrev}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={!flakyTestsData.pagination.hasNext}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-8 px-3 border border-[#2D3148] text-[#94A3B8] rounded-lg text-[13px] hover:border-[#6C63FF] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
  );
}