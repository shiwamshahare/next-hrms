import React from "react";
import { cn } from "@/lib/utils";

export interface BrutalTableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  shadow?: boolean;
}

export const BrutalTable = React.forwardRef<HTMLTableElement, BrutalTableProps>(
  ({ className, containerClassName, shadow = true, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "w-full overflow-x-auto border-2 border-black rounded-none bg-white",
          shadow ? "shadow-[6px_6px_0px_0px_#000000]" : "",
          containerClassName
        )}
      >
        <table
          ref={ref}
          className={cn(
            "w-full text-left border-collapse text-xs sm:text-sm text-black",
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

BrutalTable.displayName = "BrutalTable";

export * from "./brutal-table-header";
export * from "./brutal-table-header-cell";
export * from "./brutal-table-body";
export * from "./brutal-table-row";
export * from "./brutal-table-cell";