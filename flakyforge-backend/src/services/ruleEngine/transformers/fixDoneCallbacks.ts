export const fixDoneCallbacks = (code: string, changes: string[]): string => {
  const doneCallbackPattern = /\(\s*done\s*\)\s*=>\s*\{/g;
  const before = code;
 
  let fixedCode = code.replace(doneCallbackPattern, () => {
    changes.push("Converted done-callback pattern to async/await");
    return "async () => {";
  });
 
  if (fixedCode !== before) {
    fixedCode = fixedCode.replace(/\bdone\(\s*\)\s*;?/g, "");
  }
 
  return fixedCode;
};