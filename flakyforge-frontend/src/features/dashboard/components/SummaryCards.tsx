import { Card } from "../../../components/Card";
import { DashboardSectionError } from "./DashboardSectionError";
import { TrendingUp } from "lucide-react";

type SummaryCardProp = {
  isLoading: boolean;
  isError: boolean;
  summary: any;
};

export function SummaryCards({ summary, isLoading, isError }: SummaryCardProp) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5 animate-pulse"
          >
            <div className="h-3 w-24 bg-[#2D3148] rounded mb-3" />
            <div className="h-8 w-16 bg-[#2D3148] rounded mb-3" />
            <div className="h-3 w-20 bg-[#2D3148] rounded" />
          </Card>
        ))}

      {isError && (
        <div className="col-span-4">
          <DashboardSectionError message="Failed to load summary stats." />
        </div>
      )}

      {summary && (
        <>
          <Card className="bg-[#1A1D27] border border-[#1E2139] p-5">
            <div className="text-[#94A3B8] text-[13px] mb-2">Total Tests</div>
            <div className="text-white text-[32px] font-bold mb-2">
              {summary.totalTests.value.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-[12px]">
              <TrendingUp className="w-3.5 h-3.5" />+{summary.totalTests.change}
              % this week
            </div>
          </Card>

          <Card className="bg-[#1A1D27] border border-[#1E2139] p-5">
            <div className="text-[#94A3B8] text-[13px] mb-2">Flaky Tests</div>
            <div className="text-white text-[32px] font-bold mb-2">
              {summary.flakyTests.value}
            </div>
            <div className="text-[#22C55E] text-[12px]">
              +{summary.flakyTests.change} new today
            </div>
          </Card>

          <Card className="bg-[#1A1D27] border border-[#1E2139] p-5">
            <div className="text-[#94A3B8] text-[13px] mb-2">Tests Fixed</div>
            <div className="text-white text-[32px] font-bold mb-2">
              {summary.testsFixed.value}
            </div>
            <div className="text-[#22C55E] text-[12px]">
              {summary.testsFixed.change}% fix rate
            </div>
          </Card>

          <Card className="bg-[#1A1D27] border border-[#1E2139] p-5">
            <div className="text-[#94A3B8] text-[13px] mb-2">
              Avg Confidence
            </div>
            <div className="text-white text-[32px] font-bold mb-2">
              {Math.round(summary.avgConfidence.value * 100)}%
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] text-[12px]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                +{Math.round(summary.avgConfidence.change * 100)}% vs last run
              </span>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
