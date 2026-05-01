import { Loader2 } from "lucide-react";
import type { ReactNode, ButtonHTMLAttributes, MouseEventHandler } from "react";

type ButtonType = "submit" | "reset" | "button";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  type?: ButtonType;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  handleClick,
  type,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={`relative flex items-center justify-center gap-2 rounded-lg cursor-pointer ${className}`}
      {...props}
    >
      {isLoading && (
        <Loader2 className="absolute w-4 h-4 text-white animate-spin" />
      )}
      
      <span
        className={`flex items-center gap-2 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </span>
    </button>
  );
}
