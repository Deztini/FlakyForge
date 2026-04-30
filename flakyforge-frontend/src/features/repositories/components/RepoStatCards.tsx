import type { ConnectedRepo } from "../../../api/repoApi";
import { Card } from "../../../components/Card";

type RepoStatCardsProps = {
  isLoading: boolean;
  isError: boolean;
  repos?: ConnectedRepo[];
};

export function RepoStatCards({
  isLoading,
  isError,
  repos,
}: RepoStatCardsProps) {
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

  if (isError || !repos) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-4 text-center text-[#EF4444] text-[13px] py-6">
          Failed to load repository stats.
        </div>
      </div>
    );
  }

  const stats = [
    { title: "Total Repositories", value: repos?.length ?? 0 },
    {
      title: "Active Scans",
      value: repos?.filter((r) => r.status === "scanning").length ?? 0,
    },
    {
      title: "Total Flaky Tests",
      value: repos?.reduce((sum, r) => sum + r.flakyCount, 0) ?? 0,
    },
    {
      title: "Total Fixed",
      value: repos?.reduce((sum, r) => sum + r.fixedCount, 0) ?? 0,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5"
        >
          <div className="text-[#94A3B8] text-[13px] mb-2">{stat.title}</div>
          <div className="text-white text-[32px] font-bold">{stat.value}</div>
        </Card>
      ))}
    </div>
  );
}
