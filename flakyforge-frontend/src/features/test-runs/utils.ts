export function formatDuration(seconds?: number): string {
  if (seconds == null || seconds === 0) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function formatAvgDuration(seconds: number): string {
  return formatDuration(seconds);
}

export function formatTrigger(trigger: string): string {
  const map: Record<string, string> = {
    push: "GitHub Workflow",
    pull_request: "Pull Request",
    workflow_dispatch: "Manual",
    scheduled: "Scheduled",
  };
  return map[trigger] ?? trigger;
}

export function formatSuccessRate(rate: number): string {
  return `${rate}%`;
}