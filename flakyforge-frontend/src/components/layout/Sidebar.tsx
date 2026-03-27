import {
  LayoutDashboard,
  FolderGit2,
  AlertCircle,
  PlayCircle,
  GitPullRequest,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "../Logo";
import { useNavigate, useLocation, Link } from "@tanstack/react-router";
import { Button } from "../Button";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    badge: null,
  },
  {
    icon: FolderGit2,
    label: "Repositories",
    path: "/repositories",
    badge: null,
  },
  {
    icon: AlertCircle,
    label: "Flaky Tests",
    path: "/flaky-tests",
    badge: "12",
  },
  { icon: PlayCircle, label: "Test Runs", path: "/test-runs", badge: null },
  {
    icon: GitPullRequest,
    label: "Pull Requests",
    path: "/pull-requests",
    badge: null,
  },
  { icon: Settings, label: "Settings", path: "/settings", badge: null },
];

interface SidebarUserProps {
  name: string;
  role: string;
  initials: string;
  onLogout: () => void;
}

interface SidebarProps {
  user: SidebarUserProps;
}

function NavItem({
  icon: Icon,
  label,
  path,
  badge,
}: (typeof navItems)[number]) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <button
      onClick={() => navigate({ to: path })}
      className={`w-full h-10 rounded-lg flex items-center gap-3 px-3 transition-colors ${
        isActive
          ? "bg-[#6C63FF]/20 text-[#6C63FF] border-l-2 border-[#6C63FF]"
          : "text-[#94A3B8] hover:bg-[#2D3148]/30"
      }`}
    >
      <Icon className="w-4.5 h-4.5" />
      <span className="text-[14px] flex-1 text-left">{label}</span>
      {badge && (
        <span className="h-5 px-2 bg-[#F59E0B] text-[#0F1117] rounded-full text-[11px] font-semibold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function SidebarUser({ name, role, initials, onLogout }: SidebarUserProps) {
  return (
    <div className="p-5 border-t border-[#1E2139]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#6C63FF] flex items-center justify-center">
          <span className="text-white text-[13px] font-semibold">
            {initials}
          </span>
        </div>
        <div className="flex-1">
          <div className="text-white text-[14px]">{name}</div>
          <div className="text-[#94A3B8] text-[12px]">{role}</div>
        </div>
        <Button
          handleClick={onLogout}
          className="text-[#94A3B8] hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="w-60 bg-[#1A1D27] border-r border-[#1E2139] flex flex-col">
      <div className="p-6">
        <Link to="/">
          <Logo size="sm" />
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <div className="px-5 mb-2">
          <span className="text-[#94A3B8] text-[11px] font-semibold tracking-wider">
            MAIN MENU
          </span>
        </div>
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </nav>

      <SidebarUser {...user} />
    </aside>
  );
}
