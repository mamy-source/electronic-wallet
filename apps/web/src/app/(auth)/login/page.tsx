import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { SessionBanner } from "@/components/auth/login/SessionBanner";
import { TrustStrip } from "@/components/auth/login/TrustStrip";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Log In — MONEXA",
  description: "Access your MONEXA wallet, merchant links, and settlements.",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-tr from-primary-fixed/40 via-secondary-fixed/30 to-surface-container-high/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-20 right-10 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-2xl pointer-events-none -z-10" />

        <SessionBanner email="andry.r@gmail.com" />

        <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-xl p-4 sm:p-6 md:p-10 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-container" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div className="w-44 sm:w-52 h-auto flex items-center">
                <Logo />
              </div>
              <LanguageSwitcher />
            </div>
            <div className="pt-1">
              <h1 className="type-headline-md font-bold text-on-surface">
                Welcome back to MONEXA
              </h1>
              <p className="type-body-md text-on-surface-variant mt-0.5">
                Log in to manage your wallet, merchant links, and settlements
              </p>
            </div>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <div className="mt-1 pt-4 bg-surface-container-low/60 rounded-xl p-2 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
              <span className="type-caption-micro font-semibold uppercase tracking-wider">
                CSBF Central Bank License #MG-2023-88
              </span>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant type-caption-micro">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">enhanced_encryption</span>
                <span>256-bit AES</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">shield</span>
                <span>AI Fraud Radar</span>
              </div>
            </div>
          </div>
        </div>

        <TrustStrip />
      </div>
    </div>
  );
}