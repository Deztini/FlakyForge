interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div>
      <label className="text-[#94A3B8] text-sm mb-1 block">{label}</label>
      <input
        {...props}
        className={`w-full h-11 bg-[#0F1117] border rounded-lg px-4 text-white focus:border-[#6C63FF] outline-none ${error ? "border-red-500" : "border-[#2D3148]"}`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
