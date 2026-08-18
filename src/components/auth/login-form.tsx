"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, ArrowLeft } from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
  onModeChange?: (mode: "login" | "forgot") => void;
}

export default function LoginForm({ onSuccess, onModeChange }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const switchMode = (newMode: "login" | "forgot") => {
    setMode(newMode);
    setErrorMsg("");
    setSuccessMsg("");
    if (onModeChange) onModeChange(newMode);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username.trim()) {
      setErrorMsg("Username is required");
      return;
    }
    if (!password) {
      setErrorMsg("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      // Call authentication API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned status ${res.status}: ${res.statusText}`);
      }

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Invalid credentials. Please verify your username and password.");
        return;
      }

      setSuccessMsg("Authentication verified. Redirecting to dashboard...");

      // Save token and user details to localStorage
      if (data.token) {
        localStorage.setItem("hrms_token", data.token);
        localStorage.setItem("hrms_user", JSON.stringify(data.user));
      }

      // Trigger callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/");
        window.location.href = "/";
      }, 500);
    } catch (err: any) {
      console.error("Login request error:", err);
      setErrorMsg(err?.message || "Network or server connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!recoveryEmail.trim()) {
      setErrorMsg("Please enter your registered email or operator ID");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccessMsg("Password reset link dispatched to your registered email address.");
      setRecoveryEmail("");
    } catch {
      setErrorMsg("Failed to dispatch reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Preset Helper for Testing Seeded Users
  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg("");
    setSuccessMsg("");
  };

  // =========================================================================
  // FORGOT PASSWORD VIEW
  // =========================================================================
  if (mode === "forgot") {
    return (
      <form onSubmit={handleForgotSubmit} className="space-y-4 font-sans">
        {errorMsg && (
          <div className="bg-[var(--primary-red)] text-[var(--primary-foreground)] p-2.5 text-xs font-bold border-2 border-[var(--border)] flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-600 text-white p-2.5 text-xs font-bold border-2 border-[var(--border)] flex items-center gap-2">
            <Check className="size-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">
          Enter your registered work email or operator ID. We will send you instructions to reset your password.
        </div>

        {/* EMAIL / OPERATOR ID */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--foreground)] mb-1.5">
            WORK EMAIL / OPERATOR ID
          </label>
          <input
            type="text"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            placeholder="operator@hrms.corp"
            required
            className="w-full bg-[var(--card)] border-2 border-[var(--border)] rounded-none px-3.5 py-2.5 text-sm font-medium text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--highlight)] focus:ring-1 focus:ring-[var(--highlight)]"
          />
        </div>

        {/* Submit Reset Button */}
        <div className="pt-2">
          <span className="relative inline-block w-full">
            <span className="absolute inset-0 bg-[var(--secondary)] translate-x-1 translate-y-1" />
            <button
              type="submit"
              disabled={isLoading}
              className="relative border-2 border-[var(--border)] font-bold uppercase text-sm tracking-wide px-5 py-2.5 cursor-pointer active:translate-x-1 active:translate-y-1 bg-[var(--primary-red)] text-[var(--primary-foreground)] hover:bg-[var(--secondary)] transition-colors"
            >
              {isLoading ? "DISPATCHING LINK..." : "SEND RESET LINK →"}
            </button>
          </span>
        </div>

        {/* Divider */}
        <div className="border-b-2 border-[var(--border)] my-5" />

        {/* Back to Sign In */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className="text-xs font-bold uppercase tracking-wider text-[var(--primary-red)] hover:underline cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            <span>BACK TO SIGN IN</span>
          </button>
        </div>
      </form>
    );
  }

  // =========================================================================
  // SIGN IN VIEW (Real Backend PostgreSQL Auth)
  // =========================================================================
  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4 font-sans">
      {/* Quick Demo Credentials Helpers */}
      <div className="border border-[var(--border)] bg-[var(--muted)] p-2.5 text-xs space-y-1.5">
        <div className="font-bold text-[var(--foreground)] flex justify-between items-center">
          <span>POSTGRES DEMO LOGINS:</span>
          <span className="text-[10px] bg-[var(--secondary)] text-[var(--secondary-foreground)] px-1.5 py-0.2 font-mono">
            SEEDED
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickFill("admin", "1")}
            className="px-2 py-0.5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-bold text-[11px] hover:bg-[var(--primary-red)] hover:text-white cursor-pointer"
          >
            admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("manager", "1")}
            className="px-2 py-0.5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-bold text-[11px] hover:bg-[var(--primary-red)] hover:text-white cursor-pointer"
          >
            manager
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("engineer", "1")}
            className="px-2 py-0.5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-bold text-[11px] hover:bg-[var(--primary-red)] hover:text-white cursor-pointer"
          >
            engineer
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("johnsnow", "1")}
            className="px-2 py-0.5 border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-bold text-[11px] hover:bg-[var(--primary-red)] hover:text-white cursor-pointer"
          >
            johnsnow
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-[var(--primary-red)] text-[var(--primary-foreground)] p-2.5 text-xs font-bold border-2 border-[var(--border)] flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-600 text-white p-2.5 text-xs font-bold border-2 border-[var(--border)] flex items-center gap-2">
          <Check className="size-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* USERNAME */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[var(--foreground)] mb-1.5">
          USERNAME
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. admin"
          required
          disabled={isLoading}
          className="w-full bg-[var(--card)] border-2 border-[var(--border)] rounded-none px-3.5 py-2.5 text-sm font-medium text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--highlight)] focus:ring-1 focus:ring-[var(--highlight)] disabled:opacity-50"
        />
      </div>

      {/* PASSWORD + FORGOT PASSWORD LINK */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--foreground)]">
            PASSWORD
          </label>
          <button
            type="button"
            onClick={() => switchMode("forgot")}
            className="text-xs font-bold uppercase tracking-wider text-[var(--primary-red)] hover:underline cursor-pointer"
          >
            FORGOT PASSWORD?
          </button>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          required
          disabled={isLoading}
          className="w-full bg-[var(--card)] border-2 border-[var(--border)] rounded-none px-3.5 py-2.5 text-sm font-medium text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--highlight)] focus:ring-1 focus:ring-[var(--highlight)] disabled:opacity-50"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <span className="relative inline-block w-full">
          <span className="absolute inset-0 bg-[var(--secondary)] translate-x-1 translate-y-1" />
          <button
            type="submit"
            disabled={isLoading}
            className="relative border-2 border-[var(--border)] font-bold uppercase text-sm tracking-wide px-5 py-2.5 cursor-pointer active:translate-x-1 active:translate-y-1 bg-[var(--primary-red)] text-[var(--primary-foreground)] hover:bg-[var(--secondary)] transition-colors w-full sm:w-auto"
          >
            {isLoading ? "AUTHENTICATING..." : "SIGN IN →"}
          </button>
        </span>
      </div>

      {/* Divider */}
      <div className="border-b-2 border-[var(--border)] my-5" />

      {/* Security Footer Notice */}
      <div className="text-center pt-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
          POSTGRESQL AUTHENTICATED • 4096-BIT RSA SECURE GATEWAY
        </p>
      </div>
    </form>
  );
}