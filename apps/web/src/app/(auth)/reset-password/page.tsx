
import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Create New Password — MONEXA",
  description: "Securely reset your MONEXA account password.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <main className="w-full max-w-xl mx-auto">
      <Suspense
        fallback={
          <div className="text-center p-8 text-on-surface-variant">
            Loading password recovery...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
