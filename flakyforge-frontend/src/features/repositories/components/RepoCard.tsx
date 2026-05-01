import type { ConnectedRepo } from "../../../api/repoApi";
import { Github, Star, Loader2 } from "lucide-react";
import { Card } from "../../../components/Card";
import { StatusBadge } from "./RepositoryStatusBadge";
import { Button } from "../../../components/Button";
import { formatDistanceToNow } from "date-fns";
import type { UseMutationResult } from "@tanstack/react-query";

type RepoCardProps = {
  repo: ConnectedRepo;
  triggerScan: UseMutationResult<void, unknown, string>;
  setSelectedRepo: (repo: ConnectedRepo) => void;
};

export function RepoCard({
  repo,
  triggerScan,
  setSelectedRepo,
}: RepoCardProps) {
  return (
    <Card
      key={repo.id}
      className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6 hover:border-[#6C63FF]/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6C63FF]/20 rounded-lg flex items-center justify-center">
            <Github className="w-5 h-5 text-[#6C63FF]" />
          </div>
          <div>
            <h3 className="text-white text-[15px] font-semibold">
              {repo.fullName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {repo.language && (
                <span className="text-[#94A3B8] text-[12px]">
                  {repo.language}
                </span>
              )}
              <span className="text-[#2D3148]">•</span>
              <div className="flex items-center gap-1 text-[#94A3B8] text-[12px]">
                <Star className="w-3 h-3" />
                {repo.stars.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        <StatusBadge status={repo.status} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#1E2139]">
        <div>
          <div className="text-[#94A3B8] text-[11px] mb-1">Flaky Tests</div>
          <div className="text-[#EF4444] text-[18px] font-bold">
            {repo.flakyCount}
          </div>
        </div>
        <div>
          <div className="text-[#94A3B8] text-[11px] mb-1">Fixed</div>
          <div className="text-[#22C55E] text-[18px] font-bold">
            {repo.fixedCount}
          </div>
        </div>
        <div>
          <div className="text-[#94A3B8] text-[11px] mb-1">Last Scan</div>
          <div className="text-white text-[12px]">
            {repo.lastScannedAt
              ? formatDistanceToNow(new Date(repo.lastScannedAt), {
                  addSuffix: true,
                })
              : "Never"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          disabled={repo.status === "scanning" || triggerScan.isPending}
          onClick={() => triggerScan.mutate(repo.id)}
          className="flex-1 h-9 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {triggerScan.isPending ? (
            <>
              <Loader2 className="w-3 h-3 text-[#fff] animate-spin" />
            </>
          ) : (
            "Run Scan"
          )}
        </Button>
        <Button
          onClick={() => setSelectedRepo(repo)}
          className="flex-1 h-9 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
