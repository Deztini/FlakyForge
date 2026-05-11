type FlakyType = "async wait" | "network";
type Framework = "jest" | "vitest" | "mocha" | "cypress" | "playwright";

interface RuleEngineInput {
  testCode: string;
  flakyType: FlakyType;
  framework: Framework;
  testName: string;
}

interface RuleEngineOutput {
  fixedCode: string;
  explanation: string;
}

const getProperWaitReplacement = (framework: Framework): string => {
  switch (framework) {
    case "jest":
    case "vitest":
      return "await waitFor(() => {})";
    case "mocha":
      return "await new Promise(resolve => setImmediate(resolve))";
    case "playwright":
      return "await page.waitForLoadState('networkidle')";
    case "cypress":
      return "/* cy commands are already queued — remove this delay */";
  }
};


const addWaitForImport = (code: string, framework: "jest" | "vitest"): string => {
  const testingLibraryImportPattern =
    /import\s*\{([^}]+)\}\s*from\s*['"]@testing-library\/[^'"]+['"]/;

  if (testingLibraryImportPattern.test(code)) {
    return code.replace(testingLibraryImportPattern, (match, imports) => {
      if (imports.includes("waitFor")) return match;
      return match.replace(imports, `${imports.trim()}, waitFor`);
    });
  }
  return `import { waitFor } from '@testing-library/dom';\n` + code;
};


const injectBeforeFirstTest = (
  code: string,
  injection: string,
  changes: string[],
  changeMessage: string
): string => {
  const firstTestPattern = /^([ \t]*(?:it|test)\s*\()/m;

  if (firstTestPattern.test(code)) {
    changes.push(changeMessage);
    return code.replace(firstTestPattern, `${injection}\n\n$1`);
  }

  changes.push(changeMessage);
  return injection + "\n\n" + code;
};

const injectAfterLastTest = (
  code: string,
  injection: string,
  changes: string[],
  changeMessage: string
): string => {
  const lastIndex = code.lastIndexOf("});");

  if (lastIndex !== -1) {
    changes.push(changeMessage);
    return (
      code.slice(0, lastIndex) +
      injection +
      "\n" +
      code.slice(lastIndex)
    );
  }

  return code + "\n" + injection;
};