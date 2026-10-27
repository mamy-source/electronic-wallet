import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password/ForgotPasswordForm";
import { SecurityPanel } from "@/components/auth/forgot-password/SecurityPanel";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Reset Password — MONEXA",
  description: "Recover access to your MONEXA account using SMS, email, or CIN verification.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-sm">
            <Icon name="shield_person" className="text-[22px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="type-label-sm uppercase tracking-wider text-primary">
                Identity Recovery Protocol
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="type-caption-micro text-on-surface-variant">Active Session Safe</span>
            </div>
            <p className="type-body-sm text-on-surface-variant">
              Central Banking Authority (CSBF) Compliant Flow
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center bg-surface-container-low px-4 py-2.5 rounded-2xl shadow-sm">
          <Step n={1} label="Identify" active />
          <Divider />
          <Step n={2} label="Verify Code" />
          <Divider />
          <Step n={3} label="New Password" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <ForgotPasswordForm />
        <SecurityPanel />
      </div>
    </div>
  );
}

function Step({ n, label, active }: { n: number; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${active ? "" : "opacity-50"}`}>
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center type-label-sm font-semibold ${
          active
            ? "bg-primary text-on-primary shadow-sm"
            : "bg-surface-container-highest text-on-surface-variant"
        }`}
      >
        {n}
      </span>
      <span
        className={`type-label-md ${
          active ? "text-on-surface font-semibold" : "text-on-surface-variant font-medium"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="w-8 h-0.5 bg-outline-variant/60 mx-3 rounded-full" />;
}