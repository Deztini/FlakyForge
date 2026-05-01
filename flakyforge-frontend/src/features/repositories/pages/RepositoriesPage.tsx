import { useState } from "react";
import { AuthGuard } from "../../../components/guards/AuthGuard";
import { useConnectedRepos, useTriggerScan } from "../../../hooks/useRepos";
import { Button } from "../../../components/Button";
import { Plus } from "lucide-react";
import { RepoStatCards } from "../components/RepoStatCards";
import { RepoEmptyState } from "../components/RepoEmptyState";
import { RepoCard } from "../components/RepoCard";
import { ConnectRepoModal } from "../components/ConnectRepoModal";
import { RepoDetailsModal } from "../components/RepoDetailsModal";
import type { ConnectedRepo } from "../../../api/repoApi";
import { RepoPagination } from "../components/RepoPagination";
import { AlertCircle, Loader2 } from "lucide-react";

export function RepositoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<ConnectedRepo | null>(null);

  const {
    data,
    isLoading: reposLoading,
    isError: reposError,
  } = useConnectedRepos(currentPage, 10);

  const triggerScan = useTriggerScan();

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

        <RepoStatCards
          repos={data?.repos}
          isLoading={reposLoading}
          isError={reposError}
        />

        {reposLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin" />
          </div>
        )}

        {reposError && (
          <div className="flex items-center justify-center py-24 gap-3 text-[#EF4444]">
            <AlertCircle className="w-5 h-5" />
            <span className="text-[14px]">
              Failed to load repositories. Please try again.
            </span>
          </div>
        )}

        {!reposLoading && !reposError && data?.repos?.length === 0 && (
          <RepoEmptyState onConnect={() => setModalOpen(true)} />
        )}

        {!reposLoading &&
          !reposError &&
          data?.repos &&
          data?.repos.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-18">
                {data?.repos.map((repo) => (
                  <RepoCard
                    repo={repo}
                    triggerScan={triggerScan}
                    setSelectedRepo={setSelectedRepo}
                  />
                ))}
              </div>

              <div className="mt-14">
                <RepoPagination
                  pagination={data.pagination}
                  actualCount={data.repos.length}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}

        <ConnectRepoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <RepoDetailsModal
          repo={selectedRepo}
          onClose={() => setSelectedRepo(null)}
        />
      </div>
    </AuthGuard>
  );
}
