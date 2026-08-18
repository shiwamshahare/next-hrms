import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalTabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface BrutalTabsProps {
  tabs: BrutalTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  accent?: "main" | "plum" | "white" | "black" | "yellow" | "green" | "pink" | "cyan" | "coral" | "dark";
}

export function BrutalTabs({
  tabs,
  activeTab,
  onChange,
  className,
  accent = "plum",
}: BrutalTabsProps) {
  const accentStyles = {
    main: "bg-[#260B1F] text-white",
    plum: "bg-[#260B1F] text-white",
    white: "bg-white text-black",
    black: "bg-black text-white",
    dark: "bg-black text-white",
    yellow: "bg-[#FFDE59] text-black",
    green: "bg-[#A3E635] text-black",
    pink: "bg-[#FEA5C6] text-black",
    cyan: "bg-[#A6FAFF] text-black",
    coral: "bg-[#FF6B6B] text-white",
  }[accent];

  return (
    <div
      className={cn(
        "flex flex-wrap items-stretch gap-2.5 border-b-2 border-black pb-3",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-2 text-xs sm:text-sm font-bold tracking-tight border-2 border-black rounded-[5px] cursor-pointer select-none transition-all duration-100 flex items-center gap-2",
              isActive
                ? cn(
                    accentStyles,
                    "shadow-none translate-x-[2px] translate-y-[2px]"
                  )
                : "bg-white dark:bg-[#260B1F] text-neutral-700 dark:text-neutral-300 shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000]"
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 text-[11px] font-bold rounded-[3px] border border-black",
                  isActive ? "bg-white text-black" : "bg-[#EFE6EC] text-[#260B1F]"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
