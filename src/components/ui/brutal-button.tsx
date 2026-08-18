import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "red"
    | "white"
    | "black"
    | "dark"
    | "cancel"
    | "outline"
    | "ghost"
    | "plum"
    | "yellow"
    | "green";
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "icon";
  isLoading?: boolean;
  shadow?: "none" | "sm" | "default" | "md" | "lg";
}

export const BrutalButton = React.forwardRef<
  HTMLButtonElement,
  BrutalButtonProps
>(
  (
    {
      children,
      className,
      variant = "red",
      size = "default",
      isLoading = false,
      shadow = "default",
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold uppercase tracking-wider select-none border-2 border-[var(--border)] rounded-none cursor-pointer transition-all duration-75 focus:outline-none disabled:pointer-events-none disabled:opacity-50";

    const shadowStyles = {
      none: "shadow-none",
      sm: "shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
      default:
        "shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
      md: "shadow-brutal-card hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
      lg: "shadow-brutal-lg hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
    }[shadow];

    const variantStyles = {
      default: "bg-[var(--primary-red)] hover:bg-[var(--primary-red-hover)] text-[var(--primary-foreground)]",
      primary: "bg-[var(--primary-red)] hover:bg-[var(--primary-red-hover)] text-[var(--primary-foreground)]",
      red: "bg-[var(--primary-red)] hover:bg-[var(--primary-red-hover)] text-[var(--primary-foreground)]",
      cancel: "bg-[var(--primary-red)] hover:bg-[var(--primary-red-hover)] text-[var(--primary-foreground)] font-black",
      white: "bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--card-foreground)]",
      black: "bg-[var(--secondary)] hover:bg-neutral-900 text-[var(--secondary-foreground)]",
      dark: "bg-[var(--secondary)] hover:bg-neutral-900 text-[var(--secondary-foreground)]",
      outline: "bg-[var(--card)] hover:bg-[var(--muted)] text-[var(--card-foreground)] border-2 border-[var(--border)]",
      ghost: "border-transparent shadow-none bg-transparent hover:bg-black/10 text-[var(--foreground)]",
      plum: "bg-[var(--main)] hover:bg-[var(--main-hover)] text-[var(--primary-foreground)]",
      yellow: "bg-[var(--highlight)] text-black",
      green: "bg-emerald-600 text-white",
    }[variant];

    const sizeStyles = {
      xs: "text-xs px-2.5 py-1 gap-1",
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      default: "text-xs sm:text-sm px-5 py-2.5 gap-2",
      lg: "text-sm sm:text-base px-6 py-3 gap-2.5",
      xl: "text-base px-8 py-3.5 gap-3",
      icon: "size-9 p-2",
    }[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          shadowStyles,
          variantStyles,
          sizeStyles,
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block size-3.5 border-2 border-current border-t-transparent animate-spin" />
            <span>PROCESSING...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

BrutalButton.displayName = "BrutalButton";
