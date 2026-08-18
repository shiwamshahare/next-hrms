import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalTableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const BrutalTableBody = React.forwardRef<
  HTMLTableSectionElement,
  BrutalTableBodyProps
>(({ className, children, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn("divide-y-2 divide-black dark:divide-white/30 font-mono", className)}
      {...props}
    >
      {children}
    </tbody>
  );
});

BrutalTableBody.displayName = "BrutalTableBody";