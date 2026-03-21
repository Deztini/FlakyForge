import { Search, Bell } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface TopHeaderProps {
  title: string;
  breadcrumb: string;
  onSearch?: (query: string) => void;
  hasNotifications?: boolean;
}

function SearchBar({ onSearch }: { onSearch?: (query: string) => void }) {
  return (
    <div className="relative">
      <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search tests..."
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-56 h-9 bg-[#0F1117] border border-[#2D3148] rounded-lg pl-10 pr-4 text-white text-[13px] placeholder-[#94A3B8] focus:border-[#6C63FF] focus:outline-none transition-colors"
      />
    </div>
  );
}

function NotificationBell({ hasNotifications }: { hasNotifications?: boolean }) {
  return (
    <button className="relative text-[#94A3B8] hover:text-white transition-colors">
      <Bell className="w-5 h-5" />
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
      )}
    </button>
  );
}

export function TopHeader({
  title,
  breadcrumb,
  onSearch,
  hasNotifications = false,
}: TopHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#1A1D27] border-b border-[#1E2139] px-7 flex items-center justify-between">
      <div>
        <h1 className="text-white text-[20px] font-semibold">{title}</h1>
        <div className="text-[#94A3B8] text-[12px]">{breadcrumb}</div>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar onSearch={onSearch} />
        <NotificationBell hasNotifications={hasNotifications} />
        <button
          onClick={() => navigate({ to: '/repositories' })}
          className="h-9 px-4 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[14px] font-medium"
        >
          Connect Repo
        </button>
      </div>
    </header>
  );
}