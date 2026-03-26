interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <label className="text-[#94A3B8] text-sm mb-1 block">{label}</label>
      <input
        {...props}
        className="w-full h-11 bg-[#0F1117] border border-[#2D3148] rounded-lg px-4 text-white focus:border-[#6C63FF] outline-none"
      />
    </div>
  );
}