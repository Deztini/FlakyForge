export function getConfidenceColor(confidence?: number): string {
  if (!confidence) return "text-[#94A3B8]";
  if (confidence >= 0.8) return "text-[#22C55E]";
  if (confidence >= 0.6) return "text-[#F59E0B]";
  return "text-[#EF4444]";
}