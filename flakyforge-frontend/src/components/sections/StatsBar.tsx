const stats = [
  { id: "1", value: "2,400+", label: "Tests Analyzed" },
  { id: "2", value: "94%", label: " Classification Accuracy" },
  { id: "3", value: "3", label: "Root Causes Detected" },
  { id: "4", value: "2 mins", label: "Average Fix Time" },
];

export function StatsBar() {
  return (
    <section className="w-full bg-[#1A1D27] border-t border-b border-[#1E2139] py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((st) => (
          <div className="text-center">
            <div className="text-white text-[36px] font-bold mb-1">
              {st.value}
            </div>
            <div className="text-[#94A3B8] text-[14px]">{st.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
