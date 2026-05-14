import type { PullRequestMetrics } from "../../../api/pullRequestApi";
import { Card } from "../../../components/Card";

type PullRequestStatCardsProps = {
  isLoading: boolean;
  isError: boolean;
  metrics?: PullRequestMetrics;
};

export function PullRequestStatCards({
  isLoading,
  isError,
  metrics,
}: PullRequestStatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-4 text-center text-[#EF4444] text-[13px] py-6">
          Failed to load pull request metrics.
        </div>
      </div>
    );
  }


  const cards = [
    { title: "Total PRs", value: metrics.total.toLocaleString() },
    { title: "Open", value: metrics.breakdown.open },
    { title: "Merged", value: metrics.breakdown.merged },
    { title: "Closed", value: metrics.breakdown.closed },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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