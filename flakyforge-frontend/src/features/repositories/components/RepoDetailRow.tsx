export function RepoDetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1E2139] last:border-0">
      <div className="flex items-center gap-2 text-[#94A3B8] text-[13px]">
        {icon}
        {label}
      </div>
      <div className="text-white text-[13px] font-medium">{value}</div>
    </div>
  );
}
