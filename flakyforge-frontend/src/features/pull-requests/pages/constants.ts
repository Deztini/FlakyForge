import type { PRState } from "../../../api/pullRequestApi";

export const STATE_BADGE_CLASSES: Record<PRState, string> = {
  open: "bg-[#22C55E]/20 text-[#22C55E]",
  merged: "bg-[#A78BFA]/20 text-[#A78BFA]",
  closed: "bg-[#EF4444]/20 text-[#EF4444]",
};


export const STATE_ICON_BG: Record<PRState, string> = {
  open: "bg-[#22C55E]/10",
  merged: "bg-[#A78BFA]/10",
  closed: "bg-[#EF4444]/10",
};


export const STATE_ICON_COLOR: Record<PRState, string> = {
  open: "text-[#22C55E]",
  merged: "text-[#A78BFA]",
  closed: "text-[#EF4444]",
};


export const CAUSE_BADGE_CLASSES: Record<string, string> = {
  "async wait": "bg-[#1e2a3a] text-[#60a5fa]",
  network: "bg-[#1e3a2a] text-[#34d399]",
  concurrency: "bg-[#3a2a1e] text-[#fb923c]",
};


export const FILTER_TABS: { label: string; value: PRState | undefined }[] = [
  { label: "All PRs", value: undefined },
  { label: "Open", value: "open" },
  { label: "Merged", value: "merged" },
  { label: "Closed", value: "closed" },
];