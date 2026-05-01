import { GitBranch, Plus } from "lucide-react";
import { Button } from "../../../components/Button";

export function RepoEmptyState({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="w-20 h-20 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center mb-6">
        <GitBranch className="w-10 h-10 text-[#6C63FF]" />
      </div>
      <h3 className="text-white text-[18px] font-semibold mb-2">
        No repositories connected yet
      </h3>
      <p className="text-[#94A3B8] text-[14px] text-center max-w-sm mb-8">
        Connect your GitHub repositories to start detecting flaky tests,
        classifying root causes and applying automated repairs.
      </p>
      <Button
        leftIcon={<Plus className="w-4 h-4" />}
        onClick={onConnect}
        className="h-10 px-6 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[14px] font-medium flex items-center gap-2"
      >
        Connect your first repository
      </Button>
    </div>
  );
}
