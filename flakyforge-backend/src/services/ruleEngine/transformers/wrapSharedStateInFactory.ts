export const wrapSharedStateInFactory = (
  code: string,
  changes: string[],
): string => {
  let fixedCode = code;
 
  const fnPattern =
    /const\s+(\w+)\s*=\s*async\s*\(\s*\)\s*=>\s*\{([\s\S]*?)^\s*\};/gm;
 
  let fnMatch;
  const toWrap: Array<{ name: string; body: string; full: string }> = [];
 
  while ((fnMatch = fnPattern.exec(code)) !== null) {
    const fnName = fnMatch[1];
    const fnBody = fnMatch[2];
    const fullMatch = fnMatch[0];

    if (/\w+\+\+/.test(fnBody)) {
      toWrap.push({ name: fnName, body: fnBody, full: fullMatch });
    }
  }
 
  for (const fn of toWrap) {
    const factoryName = `make${fn.name.charAt(0).toUpperCase()}${fn.name.slice(1)}`;
 
    const factoryCode =
      `// Factory — each call site gets its own isolated counter\n` +
      `const ${factoryName} = () => {\n` +
      `  let calls = 0;\n` +
      `  return async () => {${fn.body}};\n` +
      `};\n` +
      `const ${fn.name} = ${factoryName}(); // standalone default instance`;
 
    fixedCode = fixedCode.replace(fn.full, factoryCode);
 
    const retryUsagePattern = new RegExp(
      `(withRetry\\s*\\(\\s*)${fn.name}(\\s*,)`,
      "g",
    );
 
    fixedCode = fixedCode.replace(retryUsagePattern, (_, before, after) => {
      changes.push(
        `Isolated shared counter in "${fn.name}" — withRetry now receives a fresh instance via ${factoryName}()`,
      );
      return `${before}${factoryName}()${after}`;
    });
  }
  
  fixedCode = fixedCode.replace(/^\s*let\s+calls\s*=\s*0\s*;\n/gm, "");
 
  return fixedCode;
};