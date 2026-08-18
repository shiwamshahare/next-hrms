import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface BrutalTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const BrutalTextarea = React.forwardRef<
  HTMLTextAreaElement,
  BrutalTextareaProps
>(
  (
    {
      className,
      label,
      error,
      hint,
      id,
      disabled = false,
      containerClassName,
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

        <textarea
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-white border-2 border-black rounded-none px-3.5 py-2.5 text-sm font-medium text-black placeholder:text-neutral-400 resize-y min-h-[100px]",
            "transition-all duration-75 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500",
            error ? "border-red-600" : "",
            disabled ? "opacity-50 cursor-not-allowed bg-neutral-100" : "",
            className
          )}
          {...props}
        />

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

BrutalTextarea.displayName = "BrutalTextarea";