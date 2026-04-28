import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card } from "../../../components/Card";
import { PIE_COLORS } from "../constants";
import { DashboardSectionLoader } from "./DashboardSectionLoader";
import { DashboardSectionError } from "./DashboardSectionError";

type RootCauseChartProps = {
  isLoading: boolean;
  isError: boolean;
  rootCause: any;
};

export function RootCauseChart({
  rootCause,
  isLoading,
  isError,
}: RootCauseChartProps) {
  return (
    <Card className="bg-[#1A1D27] border border-[#1E2139] p-6">
      <h3 className="text-white text-[16px] font-semibold mb-4">
        Root Cause Breakdown
      </h3>

      {isLoading && <DashboardSectionLoader />}
      {isError && <DashboardSectionError message="Failed to load breakdown." />}

      {rootCause && (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={rootCause.breakdown}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="percentage"
                nameKey="type"
              >
                {rootCause.breakdown.map((_: any, index: number) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {rootCause.breakdown.map((entry, index) => (
              <div
                key={entry.type}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index] }}
                  />
                  {/* Capitalize first letter of each word for display */}
                  <span className="text-white text-[13px] capitalize">
                    {entry.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#94A3B8] text-[13px]">
                    {entry.percentage}%
                  </span>
                  <div className="w-12 h-1.5 bg-[#0F1117] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: PIE_COLORS[index],
                        width: `${entry.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
