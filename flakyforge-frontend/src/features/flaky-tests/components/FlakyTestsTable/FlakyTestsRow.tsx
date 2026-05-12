import type { FlakyTest } from "../../../../api/flakyTestApi";
import { CAUSE_BADGE_CLASSES, STATUS_BADGE_CLASSES } from "../../constants";
import { formatConfidence, getConfidenceColor } from "../../utils";
import { formatDistanceToNow } from "date-fns";
import { useApplyFix } from "../../../../hooks/useFlakyTests";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type FlakyTestsRowProps = {
  tests: FlakyTest[];
};

export function FlakyTestsRow({ tests }: FlakyTestsRowProps) {
  const { mutate: applyFix, isPending, variables } = useApplyFix();

  if (tests.length === 0) {
    return (
      <tr>
        <td
          colSpan={8}
          className="text-center text-[#94A3B8] text-[13px] py-12"
        >
          No flaky tests found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {tests.map((test) => {
        const isFixingThisTest = isPending && variables.flakyTestId === test.id;

        return (
          <tr
            key={test.id}
            className="border-b border-[#1E2139] hover:bg-[#1E2139] transition-colors"
          >
            <td className="px-4 py-3.5">
              <div className="text-white text-[14px]">{test.name}</div>
              <div className="text-[#94A3B8] text-[12px]">{test.file}</div>
            </td>

            <td className="px-4 py-3.5 text-[#94A3B8] text-[13px]">
              {test.repositoryName}
            </td>

            <td className="px-4 py-3.5 text-center">
              {test.flakyType ? (
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] ${
                    CAUSE_BADGE_CLASSES[test.flakyType] ?? ""
                  }`}
                >
                  {test.flakyType}
                </span>
              ) : (
                <span className="text-[#94A3B8] text-[12px]">—</span>
              )}
            </td>

            <td
              className={`px-4 py-3.5 text-center text-[14px] font-semibold ${getConfidenceColor(test.confidence)}`}
            >
              {formatConfidence(test.confidence)}
            </td>

            <td className="px-4 py-3.5 text-center text-[#94A3B8] text-[13px]">
              {test.runs}
            </td>

            <td className="px-4 py-3.5 text-center text-[#94A3B8] text-[13px]">
              {test.detected
                ? formatDistanceToNow(new Date(test.detected), {
                    addSuffix: true,
                  })
                : "—"}
            </td>

            <td className="px-4 py-3.5 text-center">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] capitalize ${
                  STATUS_BADGE_CLASSES[test.status]
                }`}
              >
                {test.status}
              </span>
            </td>

            <td className="px-4 py-3.5 text-right">
              {test.status === "fixed" ? (
                <a
                  href={test.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-white text-[13px] transition-colors"
                >
                  View PR
                </a>
              ) : (
                <button
                  disabled={isFixingThisTest}
                  onClick={() =>
                    applyFix(
                      { testRunId: test.testRunId, flakyTestId: test.id },
                      {
                        onSuccess: (data) => {
                          toast.success("Fix applied successfully!", {
                            description: `PR #${data.prNumber} has been opened on GitHub.`,
                            action: {
                              label: "View PR",
                              onClick: () => window.open(data.prUrl, "_blank"),
                            },
                          });
                        },
                        onError: (error: unknown) => {
                          const message =
                            error instanceof Error
                              ? error.message
                              : "Failed to apply fix. Please try again.";
                          toast.error("Fix failed", {
                            description: message,
                          });
                        },
                      },
                    )
                  }
                  className="text-[#6C63FF] hover:text-[#5B52E8] text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 ml-auto"
                >
                  {isFixingThisTest ? (
                    <>
                      <Loader2 className="w-3 h-3 text-white animate-spin" />
                    </>
                  ) : (
                    "Apply Fix"
                  )}
                </button>
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
}
