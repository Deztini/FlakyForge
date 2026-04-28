import { STATUS_BADGE_CLASSES, CAUSE_BADGE_CLASSES } from "../../constants";
import { getConfidenceColor } from "../../utils";

export function FlakyTestsRow({ flakyTestsData }: any) {
  return (
    <>
      {flakyTestsData.flakyTests.length === 0 ? (
        <tr>
          <td
            colSpan={6}
            className="text-center text-[#94A3B8] text-[13px] py-12"
          >
            No flaky tests found.
          </td>
        </tr>
      ) : (
        flakyTestsData.flakyTests.map((test) => (
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
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] ${CAUSE_BADGE_CLASSES[test.flakyType] ?? ""}`}
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
              {/* confidence from backend is 0.92, display as 92% */}
              {test.confidence != null
                ? `${Math.round(test.confidence * 100)}%`
                : "—"}
            </td>
            <td className="px-4 py-3.5 text-center">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] capitalize ${STATUS_BADGE_CLASSES[test.status]}`}
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
                <button className="text-[#6C63FF] hover:text-[#5B52E8] text-[13px] font-medium transition-colors">
                  Apply Fix
                </button>
              )}
            </td>
          </tr>
        ))
      )}
    </>
  );
}
