import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import type { ConnectedRepo } from "../../../api/repoApi";


export function StatusBadge({ status }: { status: ConnectedRepo["status"] }) {
  if (status === "scanning") {
    return (
      <span className="px-2.5 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-[11px] font-semibold flex items-center gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        Scanning
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="px-2.5 py-1 bg-[#EF4444]/20 text-[#EF4444] rounded-full text-[11px] font-semibold flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Error
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full text-[11px] font-semibold">
      Active
    </span>
  );
}
