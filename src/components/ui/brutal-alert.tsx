import React from "react";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, X, Check, Zap } from "lucide-react";

export interface BrutalAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error" | "success" | "hazard";
  title?: string;
}

export function BrutalAlert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: BrutalAlertProps) {
  const variantStyles = {
    info: "bg-[#A6FAFF] text-black border-black shadow-[4px_4px_0px_0px_#000000]",
    warning:
      "bg-[#FFDE59] text-black border-black shadow-[4px_4px_0px_0px_#000000]",
    error:
      "bg-[#E50000] text-white border-black shadow-[4px_4px_0px_0px_#000000]",
    success:
      "bg-emerald-600 text-white border-black shadow-[4px_4px_0px_0px_#000000]",
    hazard:
      "bg-white border-black shadow-[4px_4px_0px_0px_#000000] text-black",
  }[variant];

  const renderIcon = () => {
    switch (variant) {
      case "info":
        return <Info className="size-3.5" />;
      case "warning":
        return <AlertTriangle className="size-3.5" />;
      case "error":
        return <X className="size-3.5" />;
      case "success":
        return <Check className="size-3.5" />;
      case "hazard":
        return <Zap className="size-3.5" />;
      default:
        return <Info className="size-3.5" />;
    }
  };

  return (
    <div
      className={cn(
        "relative border-2 border-black rounded-none p-4",
        variantStyles,
        className
      )}
      {...props}
    >
      {variant === "hazard" && (
        <div className="bg-black h-1.5 -mx-4 -mt-4 mb-3 border-b-2 border-black" />
      )}
      <div className="flex items-start gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center border-2 border-black rounded-none font-bold text-xs bg-white text-black shadow-[2px_2px_0px_0px_#000]">
          {renderIcon()}
        </span>
        <div className="space-y-1 text-xs sm:text-sm">
          {title && (
            <h5 className="font-bold tracking-tight uppercase">{title}</h5>
          )}
          <div className="font-medium opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}
