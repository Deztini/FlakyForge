import { useState } from "react";
import {
  X,
  Search,
  Github,
  Star,
  Lock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAvailableRepos, useConnectRepo } from "../../../hooks/useRepos";
import type { AvailableRepo, ConnectRepoPayload } from "../../../api/repoApi";
import { getErrorMessage } from "../../../hooks/useRepos";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "select" | "configure" | "success";

export function ConnectRepoModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>("select");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AvailableRepo | null>(null);
  const [config, setConfig] = useState<{
    branch: string;
    scanTrigger: ConnectRepoPayload["scanTrigger"];
    autoFixPRs: boolean;
  }>({
    branch: "main",
    scanTrigger: "push",
    autoFixPRs: false,
  });

  const { data, isLoading } = useAvailableRepos(isOpen);
  const { mutate: connectRepo, isPending, error } = useConnectRepo();

  const filtered = data?.repos.filter((r) =>
    r.fullName.toLowerCase().includes(search.toLowerCase()),
  );



  const handleSelect = (repo: AvailableRepo) => {
    setSelected(repo);
    setConfig((c) => ({ ...c, branch: repo.branch }));
    setStep("configure");
  };

  const handleConnect = () => {
    if (!selected) return;
    console.log(selected);
    connectRepo(
      {
        repoFullName: selected.fullName,
        githubRepoId: selected.id,
        language: selected.language,
        stars: selected.stars,
        branch: config.branch,
        scanTrigger: config.scanTrigger,
        autoFixPRs: config.autoFixPRs,
      },
      { onSuccess: () => setStep("success") },
    );
  };

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      setStep("select");
      setSearch("");
      setSelected(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-[#13151F] border border-[#1E2139] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2139]">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-[#6C63FF]" />
            <span className="text-white font-semibold text-[15px]">
              {step === "select" && "Select Repository"}
              {step === "configure" && "Configure Repository"}
              {step === "success" && "Repository Connected"}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "select" && (
          <div className="p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search your repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1A1D27] border border-[#1E2139] rounded-lg text-white text-[13px] placeholder-[#94A3B8] focus:outline-none focus:border-[#6C63FF] transition-colors"
              />
            </div>

            <div className="space-y-2 max-h-85 overflow-y-auto pr-1">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-[#6C63FF] animate-spin" />
                </div>
              )}

              {!isLoading && filtered?.length === 0 && (
                <div className="text-center py-10 text-[#94A3B8] text-[13px]">
                  No repositories found
                </div>
              )}

              {filtered?.map((repo) => (
                <button
                  key={repo.githubRepoId}
                  onClick={() => handleSelect(repo)}
                  className="w-full flex items-center justify-between p-3.5 bg-[#1A1D27] border border-[#1E2139] rounded-xl hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#6C63FF]/20 rounded-lg flex items-center justify-center shrink-0">
                      <Github className="w-4 h-4 text-[#6C63FF]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-[13px] font-medium">
                          {repo.fullName}
                        </span>
                        {repo.isPrivate && (
                          <Lock className="w-3 h-3 text-[#94A3B8]" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {repo.language && (
                          <span className="text-[#94A3B8] text-[11px]">
                            {repo.language}
                          </span>
                        )}
                        <span className="text-[#2D3148] text-[11px]">•</span>
                        <div className="flex items-center gap-1 text-[#94A3B8] text-[11px]">
                          <Star className="w-3 h-3" />
                          {repo.stars.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#2D3148] group-hover:text-[#6C63FF] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "configure" && selected && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3.5 bg-[#6C63FF]/10 border border-[#6C63FF]/20 rounded-xl">
              <div className="w-8 h-8 bg-[#6C63FF]/20 rounded-lg flex items-center justify-center shrink-0">
                <Github className="w-4 h-4 text-[#6C63FF]" />
              </div>
              <div>
                <p className="text-white text-[13px] font-medium">
                  {selected.fullName}
                </p>
                <p className="text-[#94A3B8] text-[11px]">
                  {selected.language} · ★ {selected.stars.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[#94A3B8] text-[12px] block mb-1.5">
                  Default branch
                </label>
                <input
                  value={config.branch}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, branch: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 bg-[#1A1D27] border border-[#1E2139] rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6C63FF] transition-colors"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] text-[12px] block mb-1.5">
                  Scan trigger
                </label>
                <select
                  value={config.scanTrigger}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      scanTrigger: e.target
                        .value as ConnectRepoPayload["scanTrigger"],
                    }))
                  }
                  className="w-full px-3 py-2.5 bg-[#1A1D27] border border-[#1E2139] rounded-lg text-white text-[13px] focus:outline-none focus:border-[#6C63FF] transition-colors appearance-none"
                >
                  <option value="push">On every push</option>
                  <option value="pull_request">On pull request</option>
                  <option value="scheduled">Scheduled (daily)</option>
                  <option value="workflow_dispatch">
                    Manual (workflow dispatch)
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#1A1D27] border border-[#1E2139] rounded-xl">
                <div>
                  <p className="text-white text-[13px] font-medium">
                    Auto-create fix PRs
                  </p>
                  <p className="text-[#94A3B8] text-[11px] mt-0.5">
                    Let FlakeyRadar open PRs with automated patches
                  </p>
                </div>
                <button
                  onClick={() =>
                    setConfig((c) => ({ ...c, autoFixPRs: !c.autoFixPRs }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    config.autoFixPRs ? "bg-[#6C63FF]" : "bg-[#2D3148]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                      config.autoFixPRs ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[#EF4444] text-[12px]">
                {getErrorMessage(error)}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setStep("select")}
                className="flex-1 h-10 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px] font-medium"
              >
                Back
              </button>
              <button
                onClick={handleConnect}
                disabled={isPending}
                className="flex-1 h-10 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? "Connecting..." : "Connect Repository"}
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-[#22C55E]/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#22C55E]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <p className="text-white text-[16px] font-semibold mb-2">
              Repository connected!
            </p>
            <p className="text-[#94A3B8] text-[13px] mb-1">
              {selected?.fullName} is now being monitored.
            </p>
            <p className="text-[#94A3B8] text-[13px] mb-6">
              The FlakeyRadar workflow has been injected and the first scan is
              queued.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setStep("select");
                  setSelected(null);
                  setSearch("");
                }}
                className="flex-1 h-10 border border-[#2D3148] text-[#94A3B8] rounded-lg hover:border-[#6C63FF] hover:text-white transition-colors text-[13px]"
              >
                Connect another
              </button>
              <button
                onClick={handleClose}
                className="flex-1 h-10 bg-[#6C63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors text-[13px] font-medium"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
