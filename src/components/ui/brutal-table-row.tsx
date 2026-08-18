import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export const BrutalTableRow = React.forwardRef<
  HTMLTableRowElement,
  BrutalTableRowProps
>(({ className, selected, children, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn(
        "transition-colors duration-75 hover:bg-[#FFFDF0] dark:hover:bg-[#20222c] group",
        selected ? "bg-[#FFE600]/20 dark:bg-[#FFE600]/10 font-bold" : "",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
});

BrutalTableRow.displayName = "BrutalTableRow";