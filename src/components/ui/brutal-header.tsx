"use client";

import React, { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { BrutalBadge } from "./brutal-badge";
import { cn } from "@/lib/utils";
import { Zap, Activity, Shield, RefreshCw, Clock } from "lucide-react";

export interface BrutalHeaderProps {
  currentView?: "login" | "dashboard";
  onNavigate?: (view: "login" | "dashboard") => void;
  userRole?: string;
  activeColor?: string;
  onColorChange?: (color: string) => void;
}

export function BrutalHeader({
  currentView = "dashboard",
  onNavigate,
  userRole = "HR_ADMIN",
}: BrutalHeaderProps) {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black select-none">
      {/* Top Banner Ticker with Lucide Icons */}
      <div className="bg-black text-white py-1 px-4 overflow-hidden border-b-2 border-black text-xs font-bold flex items-center justify-between">
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
          <span className="flex items-center gap-1.5"><Zap className="size-3 text-[#E50000]" /> HRMS // CONTROL PANEL</span>
          <span className="flex items-center gap-1.5"><Activity className="size-3 text-emerald-400" /> WORKFORCE SYSTEM STATUS: OPTIMAL</span>
          <span className="flex items-center gap-1.5"><Shield className="size-3 text-[#E50000]" /> ENTERPRISE ACCESS GRANTED</span>
          <span className="flex items-center gap-1.5"><RefreshCw className="size-3" /> REAL-TIME SYNC ACTIVE</span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0 pl-4 bg-black z-10 text-xs font-bold">
          <span className="bg-white text-black px-2 py-0.5 border border-black font-mono flex items-center gap-1">
            <Clock className="size-3" />
            <span>UTC: {timeString || "00:00:00"}</span>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-[#E50000] text-white border-2 border-black px-3.5 py-1.5 font-black text-base tracking-wider shadow-[3px_3px_0px_0px_#000000] flex items-center gap-2">
            <span className="size-2.5 bg-white inline-block" />
            <span>ADMIN // CONTROL PANEL</span>
          </div>
        </div>

        {/* Center / View Switcher */}
        {onNavigate && (
          <div className="flex items-center gap-2 bg-neutral-100 p-1 border-2 border-black">
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className={cn(
                "px-3.5 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all cursor-pointer",
                currentView === "dashboard"
                  ? "bg-[#E50000] text-white shadow-[2px_2px_0px_0px_#000]"
                  : "bg-transparent border-transparent text-black hover:bg-white"
              )}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className={cn(
                "px-3.5 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black transition-all cursor-pointer",
                currentView === "login"
                  ? "bg-white text-black shadow-[2px_2px_0px_0px_#000]"
                  : "bg-transparent border-transparent text-black hover:bg-white"
              )}
            >
              Sign In View
            </button>
          </div>
        )}

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          <BrutalBadge tone="red" size="sm">
            OPERATOR: {userRole}
          </BrutalBadge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
