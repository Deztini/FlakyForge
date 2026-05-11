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