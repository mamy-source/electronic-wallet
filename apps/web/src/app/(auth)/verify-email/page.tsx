import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailForm } from "@/components/auth/register/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email — MONEXA",
  description: "Verify your MONEXA account email address.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <main className="w-full max-w-xl mx-auto">
      <Suspense
        fallback={
          <div className="text-center p-8 text-on-surface-variant">
            Loading email verification...
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}