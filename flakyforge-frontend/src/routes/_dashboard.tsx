import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const Route = createFileRoute('/_dashboard')({
  component: dashboardLayoutRoute,
});

function dashboardLayoutRoute() {
  return (
    <DashboardLayout
      title="Dashboard"
      breadcrumb="Home / Dashboard"
    />
  );
}