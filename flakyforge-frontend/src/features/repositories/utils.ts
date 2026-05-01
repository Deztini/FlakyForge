import type { ConnectedRepo } from "../../api/repoApi";

export function formatScanTrigger(
  trigger: ConnectedRepo["scanTrigger"],
): string {
  const map: Record<ConnectedRepo["scanTrigger"], string> = {
    push: "On Push",
    pull_request: "On Pull Request",
    scheduled: "Scheduled",
    workflow_dispatch: "Manual",
  };
  return map[trigger];
}
