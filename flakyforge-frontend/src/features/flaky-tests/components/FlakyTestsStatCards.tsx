import { TrendingUp } from "lucide-react";
import type { FlakyTestMetrics } from "../../../api/flakyTestApi";
import { Card } from "../../../components/Card";

type FlakyTestsStatCardsProps = {
  isLoading: boolean;
  isError: boolean;
  metrics?: FlakyTestMetrics;
};

type StatCard = {
  title: string;
  value: string | number;
  subtext: string;
  subtextColor: string;
};

export function FlakyTestsStatCards({
  isLoading,
  isError,
  metrics,
}: FlakyTestsStatCardsProps) {
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
      <Card className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-4 text-center text-[#EF4444] text-[13px] py-6">
          Failed to load flaky test metrics.
        </div>
      </Card>
    );
  }

  const cards: StatCard[] = [
    {
      title: "Total Flaky Tests",
      value: metrics.total,
      subtext: `+${metrics.metrics.today} new today`,
      subtextColor: "text-[#EF4444]",
    },
    {
      title: "Fixed Tests",
      value: metrics.breakdown.fixed,
      subtext: `${metrics.metrics.fixRate}% fix rate`,
      subtextColor: "text-[#22C55E]",
    },
    {
      title: "Pending Fixes",
      value: metrics.breakdown.pending,
      subtext: "In progress",
      subtextColor: "text-[#F59E0B]",
    },
    {
      title: "Unfixed Tests",
      value: metrics.breakdown.unfixed,
      subtext: "Needs attention",
      subtextColor: "text-[#EF4444]",
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
          <div className="text-white text-[32px] font-bold mb-1">
            {card.value}
          </div>
          <div
            className={`flex items-center gap-1 text-[12px] ${card.subtextColor}`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{card.subtext}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
