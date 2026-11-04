
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@electronic-wallet/validation";

import { useForgotPassword } from "@/lib/hooks/use-forgot-password";

import { RecoveryMethodPicker } from "./RecoveryMethodPicker";
import { SubmitButton } from "../SubmitButton";
import { ServerError } from "../ServerError";
import { FormField } from "../FormField";
import { Logo } from "../../ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { ApiError } from "@/lib/api/api-error";

export function ForgotPasswordForm() {
  const { mutate, isPending, error, isSuccess } =
    useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    clearErrors("root");

    mutate(
      { email: data.email },
      {
        onError: (error) => {
          if (!(error instanceof ApiError)) {
            setError("root.server", {
              message: "An unexpected error occurred. Please try again.",
            });
            return;
          }

          if (error.fieldErrors?.email) {
            setError("email", {
              type: "server",
              message: error.fieldErrors.email,
            });
          }

          setError("root.server", {
            type: "server",
            message: error.message,
          });
        },
      },
    );
  };

  return (
    <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <Logo />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant type-caption-micro">
            <Icon
              name="enhanced_encryption"
              filled
              className="text-[13px] text-primary"
            />
            <span>Secure Recovery</span>
          </div>
        </div>

        <h1 className="type-headline-lg text-on-surface mb-2">
          Reset your MONEXA Password
        </h1>

        <p className="type-body-md text-on-surface-variant max-w-lg">
          Enter your registered email address and we&apos;ll
          send you a secure link to reset your password.
        </p>
      </div>

      {/* Recovery method - Email only */}
      <div className="relative z-10">
        <RecoveryMethodPicker />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 relative z-10"
        noValidate
      >
        {/* API errors */}
        {(errors.root?.server?.message || error?.message) &&
          !isSuccess && (
            <ServerError
              message={
                errors.root?.server?.message ??
                error?.message
              }
            />
          )}

        {/* Success message */}
        {isSuccess && (
          <div
            role="status"
            className="p-4 rounded-xl bg-surface-container text-on-surface type-body-sm flex items-start gap-3"
          >
            <Icon
              name="check_circle"
              className="text-[22px] text-primary shrink-0"
            />

            <div className="space-y-1">
              <span className="block font-semibold">
                Check your email
              </span>

              <p className="text-on-surface-variant">
                If an account exists with this email address,
                you will receive a password reset link shortly.
                Please also check your spam folder.
              </p>
            </div>
          </div>
        )}

        {/* Email */}
        <FormField
          label="Registered Email Address"
          type="email"
          placeholder="alex.randria@gmail.com"
          leftIcon="mail"
          autoComplete="email"
          error={errors.email?.message}
          disabled={isPending}
          {...register("email")}
        />

        {/* Security information */}
        <div className="bg-surface-container-low p-4 rounded-xl flex items-start gap-3 shadow-sm">
          <Icon
            name="verified_user"
            className="text-primary text-[22px] shrink-0 mt-0.5"
          />

          <div className="space-y-1">
            <span className="block type-label-md text-on-surface font-semibold">
              Secure Password Recovery
            </span>

            <p className="type-body-sm text-on-surface-variant">
              For your security, password recovery is handled
              through your registered email address. Never
              share your reset link with anyone.
            </p>
          </div>
        </div>

        {/* Help */}
        <div className="p-4 rounded-xl bg-surface-container flex items-start gap-3 shadow-sm">
          <Icon
            name="help_center"
            className="text-secondary text-[22px] shrink-0 mt-0.5"
          />

          <div className="space-y-1">
            <span className="type-label-sm text-on-surface font-semibold block">
              Cannot access your email?
            </span>

            <p className="type-body-sm text-on-surface-variant">
              If you no longer have access to your registered
              email address, contact MONEXA Support for
              assistance.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-2">
          <SubmitButton
            loading={isPending}
            disabled={isPending}
            icon="arrow_forward"
          >
            Send Password Reset Link
          </SubmitButton>

          <div className="flex items-center justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 type-label-md text-on-surface-variant hover:text-primary transition-colors py-1"
            >
              <Icon
                name="arrow_back"
                className="text-[16px]"
              />
              Return to MONEXA Sign In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
