export const detectSharedMutableState = (code: string): boolean => {
  const counterPattern = /(?:let|var)\s+(\w+)\s*=\s*0\s*;/g;
  let match;
 
  while ((match = counterPattern.exec(code)) !== null) {
    const varName = match[1];
 
    const usedInAsyncFn = new RegExp(
      `async[^{]*\\{[^}]*${varName}\\+\\+`,
      "s",
    ).test(code);
 
    const fnNameMatch = code.match(
      new RegExp(
        `const\\s+(\\w+)\\s*=\\s*async[^{]*\\{[^}]*${varName}\\+\\+`,
        "s",
      ),
    );
 
    if (usedInAsyncFn && fnNameMatch) {
      const fnName = fnNameMatch[1];
      const callCount = (
        code.match(new RegExp(`\\b${fnName}\\s*[\\(,]`, "g")) || []
      ).length;
 
      if (callCount >= 2) return true;
    }
  }
 
  return false;
};
 