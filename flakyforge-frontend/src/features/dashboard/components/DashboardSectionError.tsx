import { AlertCircle } from "lucide-react";

export function DashboardSectionError({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-16 gap-2 text-[#EF4444]">
      <AlertCircle className="w-4 h-4" />
      <span className="text-[13px]">{message}</span>
    </div>
  );
}