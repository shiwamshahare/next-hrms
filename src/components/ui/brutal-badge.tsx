import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?:
    | "default"
    | "red"
    | "black"
    | "white"
    | "level"
    | "nationality"
    | "new-user"
    | "outline";
  size?: "sm" | "default" | "lg";
  pulse?: boolean;
}

export function BrutalBadge({
  children,
  className,
  tone = "default",
  size = "default",
  pulse = false,
  ...props
}: BrutalBadgeProps) {
  const baseStyles =
    "inline-flex items-center font-black uppercase tracking-wider select-none whitespace-nowrap rounded-none";

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    default: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-xs sm:text-sm px-3.5 py-1.5 gap-2",
  }[size];

  const toneStyles = {
    default: "bg-[var(--primary-red)] text-[var(--primary-foreground)]",
    red: "bg-[var(--primary-red)] text-[var(--primary-foreground)]",
    "new-user": "bg-[var(--primary-red)] text-[var(--primary-foreground)] font-black",
    nationality: "bg-[var(--primary-red)] text-[var(--primary-foreground)] font-black",
    black: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
    level: "bg-[var(--secondary)] text-[var(--secondary-foreground)] px-2 py-0.5",
    white: "bg-[var(--card)] text-[var(--card-foreground)] border-2 border-[var(--border)]",
    outline: "bg-transparent text-[var(--foreground)] border-2 border-[var(--border)]",
  }[tone];

  return (
    <span
      className={cn(baseStyles, sizeStyles, toneStyles, className)}
      {...props}
    >
      {pulse && (
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-current opacity-75" />
          <span className="relative inline-flex size-2 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
