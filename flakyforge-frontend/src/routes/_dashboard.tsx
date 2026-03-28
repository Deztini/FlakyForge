import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { AuthGuard } from "../components/guards/AuthGuard";

export const Route = createFileRoute("/_dashboard")({
  component: dashboardLayoutRoute,
});

function dashboardLayoutRoute() {
  return (
    <AuthGuard>
      <DashboardLayout title="Dashboard" breadcrumb="Home / Dashboard" />
    </AuthGuard>
  );
}
