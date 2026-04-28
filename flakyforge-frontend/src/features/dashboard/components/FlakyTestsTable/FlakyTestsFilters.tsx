export function FlakyTestsFilters({ activeFilter, onFilterChange }: any) {
  const filters = ["All", "Unfixed", "Fixed"];

  return (
    <div className="p-4 flex gap-2 border-b border-[#1E2139]">
      {filters.map((f) => {
        const value = f === "All" ? undefined : f;
        const active = activeFilter === value;
        return (
          <button
            key={f}
            onClick={() => onFilterChange(value)}
            className={`px-3 py-1 rounded-full text-sm ${
              active ? "bg-[#6C63FF] text-white" : "bg-[#0F1117] text-[#94A3B8]"
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}