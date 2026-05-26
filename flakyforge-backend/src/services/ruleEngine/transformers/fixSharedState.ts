import { detectSharedMutableState } from "../analyzer/detectSharedMutableState";
import { wrapSharedStateInFactory } from "./wrapSharedStateInFactory";

export const fixSharedState = (
  code: string,
  changes: string[],
): string => {
  if (!detectSharedMutableState(code)) return code;
  return wrapSharedStateInFactory(code, changes);
};