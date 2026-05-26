import { Framework } from "../pipeline/ruleEngineService";
import { getProperWaitReplacement } from "../pipeline/ruleEngineService";

export const fixSetTimeoutDelays = (
  code: string,
  framework: Framework,
  changes: string[],
): string => {
  const setTimeoutDelayPattern =
    /await\s+new\s+Promise\(\s*(\w+)\s*=>\s*setTimeout\s*\(\s*\1\s*,\s*[^)]+\)\s*\)/g;
 
  return code.replace(setTimeoutDelayPattern, () => {
    changes.push(
      "Replaced arbitrary setTimeout delay with proper async wait",
    );
    return getProperWaitReplacement(framework);
  });
};