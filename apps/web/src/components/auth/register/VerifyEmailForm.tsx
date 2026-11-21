"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useVerifyEmail } from "@/lib/hooks/use-verify-email";
import { ApiError } from "@/lib/api/api-error";

import { Logo } from "@/components/ui/Logo";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { Icon } from "@/components/ui/Icon";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verifyEmail = useVerifyEmail();
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!token || hasSubmitted.current) return;

    hasSubmitted.current = true;
    verifyEmail.mutate(token);
  }, [token, verifyEmail.mutate]);

  const errorMessage =
    verifyEmail.error instanceof ApiError
      ? verifyEmail.error.message
      : "Unable to verify your email. The link may be invalid or expired.";

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <Logo />

        <div className="flex justify-center">
          <Icon name="error" className="text-5xl text-error" />
        </div>

        <h1 className="text-2xl font-bold text-on-surface">
          Invalid verification link
        </h1>

        <p className="text-on-surface-variant">
          The verification token is missing from the link.
          Please check your email and try again.
        </p>

        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  if (verifyEmail.isPending) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <Logo />

        <div className="flex justify-center">
          <Icon
            name="progress_activity"
            className="text-5xl text-primary animate-spin"
          />
        </div>

        <h1 className="text-2xl font-bold text-on-surface">
          Verifying your email...
        </h1>

        <p className="text-on-surface-variant">
          Please wait while we verify your email address.
        </p>
      </div>
    );
  }

  if (verifyEmail.isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <Logo />

        <div className="flex justify-center">
          <Icon
            name="check_circle"
            className="text-5xl text-success"
          />
        </div>

        <h1 className="text-2xl font-bold text-on-surface">
          Email verified successfully!
        </h1>

        <p className="text-on-surface-variant">
          Your email address has been verified.
          You can now access your MONEXA account.
        </p>

        <Link href="/login" className="block">
          <SubmitButton className="w-full">
            Continue to login
          </SubmitButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-6">
      <Logo />

      <div className="flex justify-center">
        <Icon name="error" className="text-5xl text-error" />
      </div>

      <h1 className="text-2xl font-bold text-on-surface">
        Verification failed
      </h1>

      <p className="text-on-surface-variant">
        {errorMessage}
      </p>

      <Link
        href="/login"
        className="text-primary font-semibold hover:underline"
      >
        Back to login
      </Link>
    </div>
  );
}