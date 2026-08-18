import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface BrutalSelectOption {
  value: string;
  label: string;
}

export interface BrutalSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "options"> {
  label?: string;
  error?: string;
  hint?: string;
  options: (string | BrutalSelectOption)[];
  containerClassName?: string;
}

export function BrutalSelect({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  id,
  className = "",
  containerClassName = "",
  disabled = false,
  ...props
}: BrutalSelectProps) {
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

      <div className="relative">
        <select
          id={inputId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "w-full appearance-none bg-white border-2 border-black rounded-none px-3.5 py-2.5 pr-10 text-sm font-medium text-black cursor-pointer",
            "transition-all duration-75",
            "focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500",
            error ? "border-red-600" : "",
            disabled ? "opacity-50 cursor-not-allowed bg-neutral-100" : "",
            className
          )}
          {...props}
        >
          {options.map((opt) => {
            if (typeof opt === "string") {
              return (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              );
            }
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
          <ChevronDown className="size-4" />
        </div>
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
