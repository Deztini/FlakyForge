import { Outlet } from '@tanstack/react-router';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

interface DashboardLayoutProps {
  title: string;
  breadcrumb: string;
}

const currentUser = {
  name: 'Destiny Agbator',
  role: 'Developer',
  initials: 'DA',
  onLogout: () => console.log('logout'),
};

export function DashboardLayout({ title, breadcrumb }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#0F1117] flex">
      <Sidebar user={currentUser} />

      <div className="flex-1 flex flex-col">
        <TopHeader
          title={title}
          breadcrumb={breadcrumb}
          hasNotifications
        />

        <main className="flex-1 overflow-auto p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}