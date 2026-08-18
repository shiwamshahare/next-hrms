import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalStatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeTone?: "default" | "main" | "plum" | "white" | "black" | "yellow" | "green" | "cyan" | "pink" | "orange" | "coral" | "destructive";
  accentColor?: "main" | "plum" | "white" | "black" | "yellow" | "green" | "pink" | "cyan" | "coral" | "neutral" | "dark";
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function BrutalStatCard({
  label,
  value,
  subtitle,
  badge,
  badgeTone = "plum",
  accentColor = "plum",
  icon,
  trend,
  className,
}: BrutalStatCardProps) {
  const accentBorder = {
    main: "border-t-[6px] border-t-[#260B1F]",
    plum: "border-t-[6px] border-t-[#260B1F]",
    white: "border-t-[6px] border-t-white",
    black: "border-t-[6px] border-t-black",
    yellow: "border-t-[6px] border-t-[#FFDE59]",
    green: "border-t-[6px] border-t-[#A3E635]",
    pink: "border-t-[6px] border-t-[#FEA5C6]",
    cyan: "border-t-[6px] border-t-[#A6FAFF]",
    coral: "border-t-[6px] border-t-[#FF6B6B]",
    neutral: "border-t-[6px] border-t-[#EFE6EC]",
    dark: "border-t-[6px] border-t-black",
  }[accentColor];

  const toneStyles = {
    default: "bg-[#260B1F] text-white",
    main: "bg-[#260B1F] text-white",
    plum: "bg-[#260B1F] text-white",
    white: "bg-white text-black",
    black: "bg-black text-white",
    yellow: "bg-[#FFDE59] text-black",
    green: "bg-[#A3E635] text-black",
    cyan: "bg-[#A6FAFF] text-black",
    pink: "bg-[#FEA5C6] text-black",
    orange: "bg-[#FDBA74] text-black",
    coral: "bg-[#FF6B6B] text-white",
    destructive: "bg-[#FF3344] text-white",
  }[badgeTone];

  return (
    <div
      className={cn(
        "relative bg-white dark:bg-[#160613] border-2 border-black rounded-[5px] p-5",
        "shadow-[4px_4px_0px_0px_#000000] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        accentBorder,
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          {label}
        </span>
        {badge && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 border-2 border-black rounded-[4px] shadow-[1px_1px_0px_0px_#000]",
              toneStyles
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
          {value}
        </div>
        {icon && <div className="text-xl opacity-80">{icon}</div>}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-black/15 dark:border-white/15 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 font-medium">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                "font-bold text-[11px] px-1.5 py-0.2 border border-black rounded-[3px]",
                trend.isPositive
                  ? "bg-[#EFE6EC] text-[#260B1F]"
                  : "bg-black text-white"
              )}
            >
              {trend.isPositive ? "↑ " : "↓ "}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
