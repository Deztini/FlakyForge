import type { Framework } from "../../ruleEngineService";
import { detectTimingHelpers } from "../analyzer/detectTimingHelpers";
import { detectHelperModule } from "../analyzer/detectHelperModule";
import { buildHelperMocks } from "./buildHelperMock";
import { injectAfterLastTest } from "../../ruleEngineService";

export const fixRealTimingHelpers = (
  code: string,
  framework: Framework,
  changes: string[],
): string => {
  let fixedCode = code;

  const mockPrefix = framework === "vitest" ? "vi" : "jest";
  const timingHelpers = detectTimingHelpers(fixedCode);
  const sourceModule = detectHelperModule(fixedCode);

  const alreadyMocked =
    fixedCode.includes(`${mockPrefix}.spyOn`) ||
    fixedCode.includes(`${mockPrefix}.mock(`) ||
    fixedCode.includes("jest.mock(") ||
    fixedCode.includes("vi.mock(");

  if (timingHelpers.length === 0 || alreadyMocked) return fixedCode;

  const mockBlock = buildHelperMocks(timingHelpers, mockPrefix, sourceModule);

  const firstBlockPattern = /^([ \t]*(?:describe|it|test)\s*\()/m;

  if (firstBlockPattern.test(fixedCode)) {
    fixedCode = fixedCode.replace(firstBlockPattern, `${mockBlock}\n\n$1`);
    changes.push(
      `Mocked real timing helpers (${timingHelpers.join(", ")}) to remove wall-clock dependency`,
    );
  }

  if (
    changes.length > 0 &&
    !fixedCode.includes("afterEach") &&
    !fixedCode.includes("afterAll")
  ) {
    fixedCode = injectAfterLastTest(
      fixedCode,
      `\nafterEach(() => {\n  ${mockPrefix}.restoreAllMocks();\n});`,
      changes,
      "Added afterEach to restore mocks between tests",
    );
  }

  return fixedCode;
};
