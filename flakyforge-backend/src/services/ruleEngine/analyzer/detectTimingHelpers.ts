export const detectTimingHelpers = (code: string): string[] => {
  const found: string[] = [];
 
  if (/\bsleep\s*\(\s*\d+/.test(code)) found.push("sleep");
  if (/\bfetchWithTimeout\s*\(/.test(code)) found.push("fetchWithTimeout");
  if (/\bwithRetry\s*\(/.test(code)) found.push("withRetry");
  if (/\bwaitForEvent\s*\(/.test(code)) found.push("waitForEvent");
 
  return found;
};
 