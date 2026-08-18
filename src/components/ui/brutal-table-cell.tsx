import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalTableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const BrutalTableCell = React.forwardRef<
  HTMLTableCellElement,
  BrutalTableCellProps
>(({ className, children, ...props }, ref) => {
  return (
    <td
      ref={ref}
      className={cn(
        "border-r-2 border-black/30 dark:border-white/20 last:border-r-0 px-4 py-3.5 text-xs sm:text-sm font-mono align-middle",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
});

BrutalTableCell.displayName = "BrutalTableCell";