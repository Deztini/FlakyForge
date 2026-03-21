import { Loader2 } from 'lucide-react';
import type { ReactNode, ButtonHTMLAttributes, MouseEventHandler } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  handleClick: MouseEventHandler<HTMLButtonElement>
}


export function Button({
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  handleClick,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`rounded-lg ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}