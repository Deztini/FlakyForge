export const detectHelperModule = (code: string): string => {
  const requireMatch = code.match(
    /require\s*\(\s*['"]([^'"]+asyncHelper[^'"]*)['"]\s*\)/i,
  );
  const importMatch = code.match(
    /import\s*\{[^}]+(?:sleep|fetchWithTimeout|withRetry|waitForEvent)[^}]*\}\s*from\s*['"]([^'"]+)['"]/,
  );
 
  if (requireMatch) return requireMatch[1];
  if (importMatch) return importMatch[1];
 
  return "../src/asyncHelpers"; 
};