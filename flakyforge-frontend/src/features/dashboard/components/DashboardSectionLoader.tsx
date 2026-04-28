import { Loader2 } from "lucide-react";

export function DashboardSectionLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 text-[#6C63FF] animate-spin" />
    </div>
  );
}