"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/login-form";
import { LogIn, KeyRound } from "lucide-react";

export default function LoginPage({ onSuccess }: { onSuccess?: () => void }) {
  const [currentMode, setCurrentMode] = useState<"login" | "forgot">("login");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-center items-center p-4 sm:p-6 relative bg-grid-auth font-sans">
      <div className="relative z-10 w-full max-w-md my-8 space-y-6">
        {/* Top Header Block */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="size-4 bg-[var(--primary-red)] inline-block shrink-0" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[var(--foreground)]">
              Welcome Back
            </h2>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
            {currentMode === "login"
              ? "Manage your organization's people, performance, and potential"
              : "Account Recovery & Credential Reset"}
          </p>
        </div>

        {/* Main Card */}
        <div className="border-2 border-[var(--border)] shadow-brutal-lg bg-[var(--card)] p-6 sm:p-8 rounded-none">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              {currentMode === "login" ? (
                <LogIn className="size-5 text-[var(--primary-red)] shrink-0" />
              ) : (
                <KeyRound className="size-5 text-[var(--primary-red)] shrink-0" />
              )}
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--card-foreground)]">
                {currentMode === "login" ? "SIGN IN" : "RESET PASSWORD"}
              </h1>
            </div>
            <span className="bg-[var(--primary-red)] text-[var(--primary-foreground)] font-black text-xs px-2.5 py-1 uppercase tracking-wider">
              {currentMode === "login" ? "ADMIN ACCESS" : "RECOVERY"}
            </span>
          </div>

          {/* Form */}
          <LoginForm onModeChange={setCurrentMode} onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
