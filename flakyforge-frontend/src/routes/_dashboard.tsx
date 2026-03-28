import { createFileRoute, useLocation } from "@tanstack/react-router";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { AuthGuard } from "../components/guards/AuthGuard";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayoutRoute,
});

function DashboardLayoutRoute() {
  const location = useLocation();
  const currentPathName = location.pathname;
  let breadcrumb: string;
  let pageTitle: string;
  if (currentPathName === "/dashboard") {
    pageTitle = "Dashboard";
    breadcrumb = "Home / Dashboard";
  } else if (currentPathName === "/repositories") {
    pageTitle = "Repositories";
    breadcrumb = "Home / Repositories";
  } else if (currentPathName === "/flaky-tests") {
    pageTitle = "Flaky Tests";
    breadcrumb = "Home / Flaky Tests";
  } else if (currentPathName === "/pull-requests") {
    pageTitle = "Pull Requests";
    breadcrumb = "Home / Pull Requests";
  }  else if (currentPathName === "/test-runs") {
    pageTitle = "Test Runs";
    breadcrumb = "Home / Flaky Tests";
  } 
  else if (currentPathName === "/settings") {
    pageTitle = "Settings";
    breadcrumb = "Home / Settings";
  }

  return (
    <AuthGuard>
      <DashboardLayout title={pageTitle!} breadcrumb={breadcrumb!} />
    </AuthGuard>
  );
}
