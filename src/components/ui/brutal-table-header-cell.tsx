import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalTableHeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const BrutalTableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  BrutalTableHeaderCellProps
>(({ className, children, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn(
        "border-r-2 border-black dark:border-white last:border-r-0 px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-left",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
});

BrutalTableHeaderCell.displayName = "BrutalTableHeaderCell";