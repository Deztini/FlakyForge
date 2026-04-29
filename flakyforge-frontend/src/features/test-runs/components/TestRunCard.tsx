import { CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { TestRun } from "../../../api/testRunApi";
import { STATUS_BADGE_CLASSES } from "../constants";
import { formatDuration, formatTrigger } from "../utils";
import { Card } from "../../../components/Card";

type TestRunCardProps = {
  run: TestRun;
};

function StatusIcon({ status }: { status: TestRun["status"] }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4" />;
    case "running":
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    case "failed":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
}

export function TestRunCard({ run }: TestRunCardProps) {
  const repo = run.repositoryId;

  return (
    <Card className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6 hover:border-[#6C63FF]/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white text-[16px] font-semibold">
              {repo.fullName}
            </h3>

            <span className="px-2.5 py-0.5 bg-[#0F1117] border border-[#2D3148] rounded-full text-[#94A3B8] text-[11px]">
              {repo.branch}
            </span>

            <span
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] capitalize ${
                STATUS_BADGE_CLASSES[run.status]
              }`}
            >
              <StatusIcon status={run.status} />
              {run.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#94A3B8] text-[13px]">
            <span>Run ID: {run._id.slice(-8)}</span>
            <span>•</span>
            {run.commitSha && (
              <>
                <span>Commit: {run.commitSha}</span>
                <span>•</span>
              </>
            )}
            <span>
              {formatDistanceToNow(new Date(run.startedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <button className="h-9 px-4 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium">
          View Details
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-[#1E2139]">
        <div>
          <div className="text-[#94A3B8] text-[11px] mb-1">Triggered By</div>
          <div className="text-white text-[13px]">
            {formatTrigger(run.triggeredBy)}
          </div>
        </div>

        <div>
          <div className="text-[#94A3B8] text-[11px] mb-1">Started</div>
          <div className="text-white text-[13px]">
            {new Date(run.startedAt).toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-[#94A3B8] text-[11px] mb-1">Duration</div>
          <div className="text-white text-[13px]">
            {formatDuration(run.duration)}
          </div>
        </div>

        <div>
          <div className="text-[#94A3B8] text-[11px] mb-1">Total Tests</div>
          <div className="text-white text-[13px]">
            {run.totalTests.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-[#94A3B8] text-[11px] mb-1">Flaky</div>
          <div className="text-[#F59E0B] text-[13px] font-semibold">
            {run.flakyCount}
          </div>
        </div>
      </div>
    </Card>
  );
}
