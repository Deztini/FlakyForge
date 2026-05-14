import { GitPullRequest } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PullRequestItem } from "../../../api/pullRequestApi";
import {
  STATE_BADGE_CLASSES,
  STATE_ICON_BG,
  STATE_ICON_COLOR,
  CAUSE_BADGE_CLASSES,
} from "../constants";
import { formatState, formatAdditions, formatDeletions } from "../utils";
import { Card } from "../../../components/Card";

type PullRequestCardProps = {
  pr: PullRequestItem;
};

export function PullRequestCard({ pr }: PullRequestCardProps) {
  return (
    <Card className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5 hover:border-[#6C63FF]/50 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${STATE_ICON_BG[pr.state]}`}
          >
            <GitPullRequest
              className={`w-5 h-5 ${STATE_ICON_COLOR[pr.state]}`}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-white text-[14px] font-semibold leading-snug mb-1">
              {pr.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[#94A3B8] text-[12px]">
                {pr.repositoryName}
              </span>
              <span className="text-[#94A3B8] text-[12px]">•</span>
              <span className="text-[#94A3B8] text-[12px]">
                #{pr.prNumber}
              </span>
              <span className="text-[#94A3B8] text-[12px]">•</span>
              <span className="text-[#94A3B8] text-[12px]">
                Created{" "}
                {formatDistanceToNow(new Date(pr.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <span className="text-[#94A3B8] text-[12px]">•</span>
              <span className="bg-[#0F1117] text-[#94A3B8] text-[11px] px-2 py-0.5 rounded-md font-mono">
                {pr.branch}
              </span>
            </div>
          </div>
        </div>

        <span
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium ${STATE_BADGE_CLASSES[pr.state]}`}
        >
          <GitPullRequest className="w-3 h-3" />
          {formatState(pr.state)}
        </span>
      </div>

      <p className="text-[#94A3B8] text-[13px] leading-relaxed line-clamp-2 mb-4">
        {pr.explanation}
      </p>

      <div className="flex items-center justify-between flex-wrap gap-2 pt-4 border-t border-[#1E2139]">
        <div className="flex items-center gap-3">
          {pr.flakyType && (
            <span
              className={`text-[12px] px-2.5 py-0.5 rounded-full ${
                CAUSE_BADGE_CLASSES[pr.flakyType] ?? "bg-[#1E2139] text-[#94A3B8]"
              }`}
            >
              Root Cause: {pr.flakyType}
            </span>
          )}
          <span className="text-[#4ade80] text-[12px] font-medium">
            {formatAdditions(pr.additions)}
          </span>
          <span className="text-[#f87171] text-[12px] font-medium">
            {formatDeletions(pr.deletions)}
          </span>
        </div>

        <a
          href={pr.prUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5B52E8] text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </Card>
  );
}