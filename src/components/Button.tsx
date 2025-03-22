
import React from "react";
import { cn } from "../lib/utils";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
  
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    outline: "bg-transparent border border-border text-foreground hover:bg-secondary focus:ring-primary",
    ghost: "bg-transparent hover:bg-secondary text-foreground focus:ring-primary",
    link: "bg-transparent underline-offset-4 hover:underline text-primary focus:ring-0",
  };
  
  const sizeStyles = {
    sm: "text-xs py-2 px-3",
    md: "text-sm py-2.5 px-4",
    lg: "text-base py-3 px-5",
  };
  
  const widthStyles = fullWidth ? "w-full" : "";
  
  const disabledStyles = disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        disabledStyles,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
