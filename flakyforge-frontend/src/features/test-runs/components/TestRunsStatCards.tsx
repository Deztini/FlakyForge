import type { TestRunMetrics } from "../../../api/testRunApi";
import { formatAvgDuration, formatSuccessRate } from "../utils";
import { Card } from "../../../components/Card";

type TestRunsStatCardsProps = {
  isLoading: boolean;
  isError: boolean;
  metrics?: TestRunMetrics;
};

// Same skeleton + error + data pattern as every other stat card component
export function TestRunsStatCards({
  isLoading,
  isError,
  metrics,
}: TestRunsStatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5 animate-pulse"
          >
            <div className="h-3 w-24 bg-[#2D3148] rounded mb-3" />
            <div className="h-8 w-16 bg-[#2D3148] rounded mb-3" />
            <div className="h-3 w-20 bg-[#2D3148] rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-4 text-center text-[#EF4444] text-[13px] py-6">
          Failed to load test run metrics.
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Runs",
      value: metrics.totalRuns.toLocaleString(),
    },
    {
      title: "Runs Today",
      value: metrics.runsToday,
    },
    {
      title: "Success Rate",
      value: formatSuccessRate(metrics.successRate),
    },
    {
      title: "Avg Duration",
      value: formatAvgDuration(metrics.avgDuration),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5"
        >
          <div className="text-[#94A3B8] text-[13px] mb-2">{card.title}</div>
          <div className="text-white text-[32px] font-bold">{card.value}</div>
        </Card>
      ))}
    </div>
  );
}
