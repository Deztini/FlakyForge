export const CAUSE_BADGE_CLASSES: Record<string, string> = {
  "async wait": "bg-[#6C63FF]/20 text-[#6C63FF]",
  concurrency: "bg-[#F59E0B]/20 text-[#F59E0B]",
  network: "bg-[#3B82F6]/20 text-[#3B82F6]",
};

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  fixed: "bg-[#22C55E]/20 text-[#22C55E]",
  pending: "bg-[#F59E0B]/20 text-[#F59E0B]",
  unfixed: "bg-[#EF4444]/20 text-[#EF4444]",
};

export const FILTER_TABS = [
  { label: "All", value: undefined },
  { label: "Unfixed", value: "unfixed" },
  { label: "Pending", value: "pending" },
  { label: "Fixed", value: "fixed" },
] as const;