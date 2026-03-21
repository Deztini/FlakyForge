import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export const Route = createFileRoute('/__dashboard')({
  component: DashboardLayoutRoute,
});

function DashboardLayoutRoute() {
  return (
    <DashboardLayout
      title="Dashboard"
      breadcrumb="Home / Dashboard"
    />
  );
}