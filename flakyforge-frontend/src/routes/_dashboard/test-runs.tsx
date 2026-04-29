import { createFileRoute } from "@tanstack/react-router";
import { TestRunsPage } from "../../features/test-runs/pages/TestRunsPage";

export const Route = createFileRoute("/_dashboard/test-runs")({
  component: TestRunsPage,
});
