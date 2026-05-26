export const validateOutput = (
  original: string,
  fixed: string,
  testName: string,
): { safe: boolean; reason: string } => {
 
  const originalLines = original.split("\n").length;
  const fixedLines = fixed.split("\n").length;
 
  if (fixedLines < originalLines * 0.95) {
    return {
      safe: false,
      reason: `Line count dropped from ${originalLines} to ${fixedLines} — possible content loss`,
    };
  }
 
  const countTests = (code: string) =>
    (code.match(/^\s*(?:it|test)\s*\(/gm) || []).length;
 
  const originalTests = countTests(original);
  const fixedTests = countTests(fixed);
 
  if (fixedTests < originalTests) {
    return {
      safe: false,
      reason: `Test count dropped from ${originalTests} to ${fixedTests} in "${testName}" — tests were removed`,
    };
  }
 
  const trimmed = fixed.trimEnd();
  if (
    trimmed.endsWith(",") ||
    trimmed.endsWith("(") ||
    trimmed.endsWith("{") ||
    trimmed.endsWith("=>")
  ) {
    return {
      safe: false,
      reason: `Fixed code appears truncated — ends with "${trimmed.slice(-5)}"`,
    };
  }

  const countChar = (str: string, ch: string) =>
    (str.match(new RegExp(`\\${ch}`, "g")) || []).length;
 
  const origOpen = countChar(original, "{");
  const origClose = countChar(original, "}");
  const fixOpen = countChar(fixed, "{");
  const fixClose = countChar(fixed, "}");
 
  if (origOpen === origClose && fixOpen !== fixClose) {
    return {
      safe: false,
      reason: `Brace mismatch after fix — ${fixOpen} opening vs ${fixClose} closing braces`,
    };
  }
 
  return { safe: true, reason: "" };
};
 