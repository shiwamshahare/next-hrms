import React from "react";
import { cn } from "@/lib/utils";
import { Minus, Square, X } from "lucide-react";

export interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: "none" | "sm" | "default" | "md" | "lg";
  windowHeader?: string;
  windowAccent?: "main" | "red" | "white" | "black" | "yellow" | "green" | "dark" | "default";
  hoverLift?: boolean;
}

export function BrutalCard({
  children,
  className = "",
  shadow = "default",
  windowHeader,
  windowAccent = "red",
  hoverLift = false,
  ...props
}: BrutalCardProps) {
  const shadowStyles = {
    none: "shadow-none",
    sm: "shadow-[2px_2px_0px_0px_#000000]",
    default: "shadow-[4px_4px_0px_0px_#000000]",
    md: "shadow-[6px_6px_0px_0px_#000000]",
    lg: "shadow-[8px_8px_0px_0px_#000000]",
  }[shadow];

  const hoverStyles = hoverLift
    ? "transition-all duration-75 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
    : "";

  const windowAccentStyles = {
    main: "bg-[#E50000] text-white",
    red: "bg-[#E50000] text-white",
    white: "bg-white text-black",
    black: "bg-black text-white",
    dark: "bg-black text-white",
    yellow: "bg-[#FFDE59] text-black",
    green: "bg-[#A3E635] text-black",
    default: "bg-[#E50000] text-white",
  }[windowAccent];

  return (
    <div
      className={cn(
        "relative bg-white border-2 border-black rounded-none text-black",
        shadowStyles,
        hoverStyles,
        className
      )}
      {...props}
    >
      {/* Title Bar with Lucide Window Controls */}
      {windowHeader && (
        <div
          className={cn(
            "flex items-center justify-between px-3.5 py-2 border-b-2 border-black font-bold text-xs uppercase tracking-wide select-none",
            windowAccentStyles
          )}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 bg-white border border-black" />
            <span className="truncate">{windowHeader}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="size-4 border border-black flex items-center justify-center bg-white text-black">
              <Minus className="size-2.5" />
            </span>
            <span className="size-4 border border-black flex items-center justify-center bg-white text-black">
              <Square className="size-2" />
            </span>
            <span className="size-4 border border-black flex items-center justify-center bg-white text-black">
              <X className="size-2.5" />
            </span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function BrutalCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-5 sm:p-6 border-b-2 border-black space-y-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BrutalCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg sm:text-xl font-bold tracking-tight text-black",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function BrutalCardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs sm:text-sm text-neutral-600 font-medium",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function BrutalCardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function BrutalCardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 sm:p-6 border-t-2 border-black flex items-center justify-between gap-4 bg-neutral-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}