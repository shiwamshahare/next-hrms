"use client";

import { useState } from "react";
import HRMSDashboard from "@/components/hrms/hrms-dashboard";
import LoginPage from "./login/page";

export default function Home() {
  const [currentView, setCurrentView] = useState<"dashboard" | "login">("dashboard");

  if (currentView === "login") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setCurrentView("dashboard")}
          className="fixed top-4 left-4 z-50 bg-[var(--secondary)] text-[var(--secondary-foreground)] border-2 border-[var(--border)] rounded-none px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_var(--shadow-color)] hover:bg-neutral-800 transition-all cursor-pointer"
        >
          ← Return to Dashboard
        </button>
        <LoginPage onSuccess={() => setCurrentView("dashboard")} />
      </div>
    );
  }

  return <HRMSDashboard onSwitchToLogin={() => setCurrentView("login")} />;
}
