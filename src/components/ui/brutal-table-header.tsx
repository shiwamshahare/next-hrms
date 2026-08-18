import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalTableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  accent?: "black" | "red" | "white" | "default";
}

export const BrutalTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  BrutalTableHeaderProps
>(({ className, accent = "black", children, ...props }, ref) => {
  const accentStyles = {
    black: "bg-black text-white",
    default: "bg-black text-white",
    red: "bg-[#E50000] text-white",
    white: "bg-white text-black border-b-2 border-black",
  }[accent];

  return (
    <thead
      ref={ref}
      className={cn(
        "border-b-2 border-black select-none",
        accentStyles,
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
});

BrutalTableHeader.displayName = "BrutalTableHeader";