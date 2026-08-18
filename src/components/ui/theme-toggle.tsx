"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center gap-2 border-2 border-black rounded-none px-3 py-1.5 text-xs font-bold uppercase tracking-wider",
        "bg-white text-black cursor-pointer select-none",
        "shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all",
        className
      )}
      title="Toggle Light/Dark Theme"
    >
      {isDark ? (
        <>
          <Moon className="size-3.5" />
          <span>DARK</span>
        </>
      ) : (
        <>
          <Sun className="size-3.5" />
          <span>LIGHT</span>
        </>
      )}
    </button>
  );
}
