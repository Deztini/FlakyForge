import { Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-[28px]',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <Zap className={`${iconSizes[size]} text-[#6C63FF] fill-[#6C63FF]`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[60%] h-[px] bg-[#0F1117] rotate-45 origin-center"></div>
        </div>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-semibold text-white tracking-tight`}>
          FlakeForge
        </span>
      )}
    </div>
  );
}
