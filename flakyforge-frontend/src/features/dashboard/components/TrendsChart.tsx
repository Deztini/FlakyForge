import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../../../components/Card";
import { DashboardSectionLoader } from "./DashboardSectionLoader";
import { DashboardSectionError } from "./DashboardSectionError";

type TrendChartProps = {
  isLoading: boolean;
  isError: boolean;
  trends: any;
};

export function TrendsChart({ isLoading, isError, trends }: TrendChartProps) {
  return (
    <>
      <Card className="lg:col-span-2 bg-[#1A1D27] border border-[#1E2139] p-6">
        <h3 className="text-white text-[16px] font-semibold mb-4">
          Flaky Test Trends
        </h3>

        {isLoading && <DashboardSectionLoader />}
        {isError && (
          <DashboardSectionError message="Failed to load trend data." />
        )}

        {!isLoading && !isError && trends && (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3148" />
              <XAxis
                dataKey="day"
                stroke="#94A3B8"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#94A3B8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1D27",
                  border: "1px solid #2D3148",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "13px" }} />
              <Line
                type="monotone"
                dataKey="detected"
                stroke="#6C63FF"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Detected"
              />
              <Line
                type="monotone"
                dataKey="fixed"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Fixed"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </>
  );
}
