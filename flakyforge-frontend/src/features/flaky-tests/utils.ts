export function formatConfidence(confidence?: number): string {
  if (confidence == null) return "—";
  return `${Math.round(confidence * 100)}%`;
}

export function getConfidenceColor(confidence?: number): string {
  if (confidence == null) return "text-[#94A3B8]";
  if (confidence >= 0.8) return "text-[#22C55E]";
  if (confidence >= 0.6) return "text-[#F59E0B]";
  return "text-[#EF4444]";
}