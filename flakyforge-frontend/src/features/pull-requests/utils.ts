import type { PRState } from "../../api/pullRequestApi";

export function formatState(state: PRState): string {
  const map: Record<PRState, string> = {
    open: "Open",
    merged: "Merged",
    closed: "Closed",
  };
  return map[state];
}

export function formatAdditions(additions: number): string {
  return `+${additions}`;
}

export function formatDeletions(deletions: number): string {
  return `-${deletions}`;
}