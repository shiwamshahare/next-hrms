import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface BrutalInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  containerClassName?: string;
  hasYellowHighlight?: boolean;
}

export const BrutalInput = React.forwardRef<HTMLInputElement, BrutalInputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      prefixIcon,
      suffixIcon,
      type = "text",
      disabled = false,
      id,
      containerClassName,
      hasYellowHighlight = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="block text-xs font-black uppercase tracking-wider text-black"
            >
              {label} {props.required && <span className="text-red-600">*</span>}
            </label>
            {hint && !error && (
              <span className="text-xs text-neutral-500 font-medium">
                {hint}
              </span>
            )}
          </div>
        )}

        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3.5 pointer-events-none text-black">
              {prefixIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            className={cn(
              "w-full bg-white border-2 border-black rounded-none px-3.5 py-2.5 text-sm font-medium text-black placeholder:text-neutral-400",
              "transition-all duration-75",
              "focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500",
              hasYellowHighlight ? "border-yellow-500 ring-1 ring-yellow-500" : "",
              error ? "border-red-600 focus:border-red-600 focus:ring-red-600" : "",
              prefixIcon ? "pl-10" : "",
              suffixIcon ? "pr-10" : "",
              disabled ? "opacity-50 cursor-not-allowed bg-neutral-100" : "",
              className
            )}
            {...props}
          />

          {suffixIcon && (
            <div className="absolute right-3.5 flex items-center text-black">
              {suffixIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="inline-flex items-center gap-1.5 bg-[#E50000] text-white px-2 py-0.5 text-xs font-bold">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

BrutalInput.displayName = "BrutalInput";
