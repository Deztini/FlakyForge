import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { useAuthStore } from "../../store/authStore";
import { useLogout } from "../../hooks/useAuth";
import { getErrorMessage } from "../../hooks/useAuth";

interface DashboardLayoutProps {
  title: string;
  breadcrumb: string;
}

export function DashboardLayout({ title, breadcrumb }: DashboardLayoutProps) {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const errorMessage = logoutMutation.error
    ? getErrorMessage(logoutMutation.error)
    : null;

  const fullName = user?.name.split(" ");
  const firstName = fullName[0];
  const lastName = fullName[1];
  const firstInitials = firstName.charAt(0);
  const secondInitials = lastName.charAt(0);
  const fullInitials = firstInitials + secondInitials;

  const currentUser = {
    name: user?.name ,
    role: user?.role,
    initials: fullInitials,
    onLogout: () => logoutMutation.mutate()
  };
  return (
    <div className="min-h-screen w-full bg-[#0F1117] flex">
      <Sidebar user={currentUser} />

      <div className="flex-1 flex flex-col">
        <TopHeader title={title} breadcrumb={breadcrumb} hasNotifications />

        <main className="flex-1 overflow-auto p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
