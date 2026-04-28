import { createFileRoute } from "@tanstack/react-router";
import { FlakyTestsPage } from "../../features/flaky-tests/pages/FlakyTestsPage";

export const Route = createFileRoute("/_dashboard/flaky-tests")({
  component: FlakyTestsPage,
});
