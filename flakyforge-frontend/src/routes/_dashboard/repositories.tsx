import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Github,
  Star,
  Plus,
  GitBranch,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card } from "../../components/Card";
import { AuthGuard } from "../../components/guards/AuthGuard";
import { ConnectRepoModal } from "../../components/sections/ConnectRepoModal";
import { useConnectedRepos, useTriggerScan } from "../../hooks/useRepos";
import type { ConnectedRepo } from "../../api/repoApi";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../../components/Button";
import { RepoDetailsModal } from "../../components/sections/RepoDetailsModal";

export const Route = createFileRoute("/_dashboard/repositories")({
  component: RepositoryPage,
});

function StatusBadge({ status }: { status: ConnectedRepo["status"] }) {
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

function EmptyState({ onConnect }: { onConnect: () => void }) {
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

function RepositoryPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedRepo, setSelectedRepo] = useState<ConnectedRepo | null>(null);
  const { data, isLoading, isError } = useConnectedRepos();

  const repos = data?.repos ?? [];

  const triggerScan = useTriggerScan();

  const totalFlaky = repos?.reduce((sum, r) => sum + r.flakyCount, 0) ?? 0;
  const totalFixed = repos?.reduce((sum, r) => sum + r.fixedCount, 0) ?? 0;
  const activeScans = repos?.filter((r) => r.status === "scanning").length ?? 0;

  const repoStatistics = [
    { title: "Total Repositories", value: repos?.length ?? 0 },
    { title: "Active Scans", value: activeScans },
    { title: "Total Flaky Tests", value: totalFlaky },
    { title: "Total Fixed", value: totalFixed },
  ];

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-[24px] font-semibold mb-1">
              Connected Repositories
            </h2>
            <p className="text-[#94A3B8] text-[14px]">
              Manage and monitor your GitHub repositories
            </p>
          </div>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
            className="h-10 px-5 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[14px] font-medium flex items-center gap-2"
          >
            Connect Repository
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {repoStatistics.map((stat) => (
            <Card
              key={stat.title}
              className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-5"
            >
              <div className="text-[#94A3B8] text-[13px] mb-2">
                {stat.title}
              </div>
              <div className="text-white text-[32px] font-bold">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin" />
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-24 gap-3 text-[#EF4444]">
            <AlertCircle className="w-5 h-5" />
            <span className="text-[14px]">
              Failed to load repositories. Please try again.
            </span>
          </div>
        )}

        {!isLoading && !isError && repos?.length === 0 && (
          <EmptyState onConnect={() => setModalOpen(true)} />
        )}

        {!isLoading && !isError && repos && repos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {repos.map((repo) => (
              <Card
                key={repo._id}
                className="bg-[#1A1D27] border border-[#1E2139] rounded-xl p-6 hover:border-[#6C63FF]/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6C63FF]/20 rounded-lg flex items-center justify-center">
                      <Github className="w-5 h-5 text-[#6C63FF]" />
                    </div>
                    <div>
                      <h3 className="text-white text-[15px] font-semibold">
                        {repo.fullName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {repo.language && (
                          <span className="text-[#94A3B8] text-[12px]">
                            {repo.language}
                          </span>
                        )}
                        <span className="text-[#2D3148]">•</span>
                        <div className="flex items-center gap-1 text-[#94A3B8] text-[12px]">
                          <Star className="w-3 h-3" />
                          {repo.stars.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={repo.status} />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-[#1E2139]">
                  <div>
                    <div className="text-[#94A3B8] text-[11px] mb-1">
                      Flaky Tests
                    </div>
                    <div className="text-[#EF4444] text-[18px] font-bold">
                      {repo.flakyCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#94A3B8] text-[11px] mb-1">Fixed</div>
                    <div className="text-[#22C55E] text-[18px] font-bold">
                      {repo.fixedCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#94A3B8] text-[11px] mb-1">
                      Last Scan
                    </div>
                    <div className="text-white text-[12px]">
                      {repo.lastScannedAt
                        ? formatDistanceToNow(new Date(repo.lastScannedAt), {
                            addSuffix: true,
                          })
                        : "Never"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    disabled={
                      repo.status === "scanning" || triggerScan.isPending
                    }
                    onClick={() => triggerScan.mutate(repo._id)}
                    className="flex-1 h-9 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {triggerScan.isPending ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Triggering...
                      </>
                    ) : (
                      "Run Scan"
                    )}
                  </Button>
                  <Button
                    onClick={() => setSelectedRepo(repo)}
                    className="flex-1 h-9 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ConnectRepoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <RepoDetailsModal
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </AuthGuard>
  );
}
