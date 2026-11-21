
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordFormSchema,
  type ResetPasswordFormInput,
} from "@/lib/schemas/reset-password-form.schema";

import { useResetPassword } from "@/lib/hooks/use-reset-password";
import { ApiError } from "@/lib/api/api-error";

import { Logo } from "@/components/ui/Logo";
import { SubmitButton } from "../SubmitButton";
import { ServerError } from "../ServerError";
import { FormField } from "../FormField";
import { Icon } from "@/components/ui/Icon";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const { mutate, isPending, isSuccess } = useResetPassword();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormInput) => {
    clearErrors("root");

    if (!token) {
      setError("root.server", {
        message: "Invalid or missing password reset token.",
      });
      return;
    }

    mutate(
      {
        token,
        newPassword: data.newPassword,
      },
      {
        onError: (error) => {
          setError("root.server", {
            message:
              error instanceof ApiError
                ? error.message
                : "Unable to reset your password. Please try again.",
          });
        },
      },
    );
  };

  if (!token) {
    return (
      <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-xl text-center space-y-4">
        <Icon name="error" className="text-error text-[40px]" />

        <h1 className="type-headline-lg text-on-surface">
          Invalid Reset Link
        </h1>

        <p className="type-body-md text-on-surface-variant">
          This password reset link is invalid or incomplete.
          Please request a new one.
        </p>

        <Link
          href="/forgot-password"
          className="inline-block text-primary font-semibold hover:underline"
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-surface-container-lowest rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-5">
        <Icon
          name="check_circle"
          className="text-primary text-[48px]"
        />

        <h1 className="type-headline-lg text-on-surface">
          Password Updated Successfully
        </h1>

        <p className="type-body-md text-on-surface-variant">
          Your password has been reset. You can now sign in
          with your new password.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-xl bg-primary text-on-primary px-6 py-3 font-semibold"
        >
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-7">
        <Logo />

        <div className="space-y-2">
          <h1 className="type-headline-lg text-on-surface">
            Create a New Password
          </h1>

          <p className="type-body-md text-on-surface-variant">
            Choose a secure password for your MONEXA account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {errors.root?.server?.message && (
            <ServerError message={errors.root.server.message} />
          )}

          {/* New Password */}
          <div className="relative">
            <FormField
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              autoComplete="new-password"
              leftIcon="lock"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-on-surface-variant hover:text-primary"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <Icon
                name={showPassword ? "visibility_off" : "visibility"}
                className="text-[21px]"
              />
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <FormField
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              leftIcon="lock"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              className="absolute right-3 top-[38px] text-on-surface-variant hover:text-primary"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmation password"
                  : "Show confirmation password"
              }
            >
              <Icon
                name={
                  showConfirmPassword
                    ? "visibility_off"
                    : "visibility"
                }
                className="text-[21px]"
              />
            </button>
          </div>

          {/* Security information */}
          <div className="rounded-xl bg-surface-container-low p-4 flex items-start gap-3">
            <Icon
              name="verified_user"
              className="text-primary text-[22px] shrink-0"
            />

            <p className="type-body-sm text-on-surface-variant">
              Use a unique password with at least 8 characters.
              Avoid reusing passwords from other accounts.
            </p>
          </div>

          <SubmitButton
            loading={isPending}
            disabled={isPending}
            icon="arrow_forward"
          >
            Reset Password
          </SubmitButton>

          <div className="text-center">
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline type-body-sm"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
