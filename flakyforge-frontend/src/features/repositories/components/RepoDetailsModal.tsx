import {
  X,
  Github,
  GitBranch,
  Star,
  Globe,
  Calendar,
  Zap,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { ConnectedRepo } from "../../../api/repoApi";
import { formatScanTrigger } from "../utils";
import { RepoDetailRow } from "./RepoDetailRow";

interface RepoDetailsModalProps {
  repo: ConnectedRepo | null;
  onClose: () => void;
}

export function RepoDetailsModal({ repo, onClose }: RepoDetailsModalProps) {
  if (!repo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#13151F] border border-[#1E2139] rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-[#1E2139]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6C63FF]/20 rounded-lg flex items-center justify-center">
              <Github className="w-5 h-5 text-[#6C63FF]" />
            </div>
            <div>
              <h2 className="text-white text-[16px] font-semibold">
                {repo.fullName}
              </h2>
              {repo.language && (
                <p className="text-[#94A3B8] text-[12px] mt-0.5">
                  {repo.language}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white transition-colors mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 divide-x divide-[#1E2139] border-b border-[#1E2139]">
          <div className="flex flex-col items-center py-4 gap-1">
            <span className="text-[#EF4444] text-[22px] font-bold">
              {repo.flakyCount}
            </span>
            <span className="text-[#94A3B8] text-[11px]">Flaky Tests</span>
          </div>
          <div className="flex flex-col items-center py-4 gap-1">
            <span className="text-[#22C55E] text-[22px] font-bold">
              {repo.fixedCount}
            </span>
            <span className="text-[#94A3B8] text-[11px]">Fixed</span>
          </div>
          <div className="flex flex-col items-center py-4 gap-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-white text-[22px] font-bold">
                {repo.stars.toLocaleString()}
              </span>
            </div>
            <span className="text-[#94A3B8] text-[11px]">Stars</span>
          </div>
        </div>

        <div className="px-6 py-2">
          <RepoDetailRow
            icon={<GitBranch className="w-4 h-4" />}
            label="Branch"
            value={repo.branch}
          />
          <RepoDetailRow
            icon={<Zap className="w-4 h-4" />}
            label="Scan Trigger"
            value={formatScanTrigger(repo.scanTrigger)}
          />
          <RepoDetailRow
            icon={<ShieldCheck className="w-4 h-4" />}
            label="Auto Fix PRs"
            value={
              repo.autoFixPRs ? (
                <span className="text-[#22C55E]">Yes</span>
              ) : (
                <span className="text-[#94A3B8]">No</span>
              )
            }
          />
          <RepoDetailRow
            icon={
              repo.status === "scanning" ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B]" />
              ) : repo.status === "error" ? (
                <AlertCircle className="w-4 h-4 text-[#EF4444]" />
              ) : (
                <Globe className="w-4 h-4" />
              )
            }
            label="Status"
            value={
              repo.status === "scanning" ? (
                <span className="text-[#F59E0B] capitalize">Scanning</span>
              ) : repo.status === "error" ? (
                <span className="text-[#EF4444] capitalize">Error</span>
              ) : (
                <span className="text-[#22C55E] capitalize">Active</span>
              )
            }
          />
          <RepoDetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Last Scan"
            value={
              repo.lastScannedAt
                ? formatDistanceToNow(new Date(repo.lastScannedAt), {
                    addSuffix: true,
                  })
                : "Never"
            }
          />
          <RepoDetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Connected"
            value={format(new Date(repo.createdAt), "MMM d, yyyy")}
          />
        </div>

        <div className="p-6 pt-4">
          <button
            onClick={onClose}
            className="w-full h-9 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
