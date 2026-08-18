import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRMS // NEO-BRUTALIST ENTERPRISE CORE",
  description: "Human Resource Management System - High Contrast Neo-Brutalist Architecture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-mono" cz-shortcut-listen="true">
        {children}
      </body>
    </html>
  );
}
