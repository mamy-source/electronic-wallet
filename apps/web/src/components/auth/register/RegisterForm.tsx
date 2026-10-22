
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { RegisterUserDto } from "@electronic-wallet/shared";

import {
  registerFormSchema,
  type RegisterFormInput,
} from "@/lib/schemas/register-form.schema";

import { useRegister } from "@/lib/hooks/use-register";

import { FormField } from "../FormField";
import { SubmitButton } from "../SubmitButton";
import { ServerError } from "../ServerError";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      profile: {
        firstName: "",
        lastName: "",
      },
      acceptTerms: false,
    },
  });

  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const onSubmit = (data: RegisterFormInput) => {
    const payload: RegisterUserDto = {
      email: data.email,
      password: data.password,
      profile: {
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
      },
    };

    mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {/* Server error */}
      <ServerError message={error?.message} />

      {/* Personal information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          placeholder="Jean-Luc"
          leftIcon="person"
          autoComplete="given-name"
          error={errors.profile?.firstName?.message}
          {...register("profile.firstName")}
        />

        <FormField
          label="Last Name"
          placeholder="Rakotomalala"
          leftIcon="badge"
          autoComplete="family-name"
          error={errors.profile?.lastName?.message}
          {...register("profile.lastName")}
        />
      </div>

      {/* Email */}
      <FormField
        label="Email Address"
        type="email"
        placeholder="jeanluc@example.com"
        leftIcon="mail"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="register-password"
          className="type-label-sm text-on-surface"
        >
          Security Password
        </label>

        <div className="relative flex items-center">
          <span
            aria-hidden="true"
            className="material-symbols-outlined absolute left-3 text-outline text-[20px] pointer-events-none"
          >
            lock
          </span>

          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a secure password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "register-password-error" : undefined
            }
            className="w-full h-11 pl-10 pr-11 rounded-lg bg-surface-container-lowest type-body-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 p-1 rounded-lg text-outline hover:text-on-surface"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[20px]"
            >
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>

        {errors.password && (
          <p
            id="register-password-error"
            role="alert"
            className="type-caption-micro text-error"
          >
            {errors.password.message}
          </p>
        )}

        <PasswordStrengthMeter value={password ?? ""} />
      </div>

      {/* Terms and conditions */}
      <div className="pt-2">
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded accent-primary cursor-pointer"
            aria-invalid={!!errors.acceptTerms}
            {...register("acceptTerms")}
          />

          <span className="type-body-sm text-on-surface-variant">
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-primary font-medium hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary font-medium hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {errors.acceptTerms && (
          <p role="alert" className="type-caption-micro text-error mt-1">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-2 pt-1">
        <SubmitButton
          loading={isPending}
          disabled={isPending}
          icon="arrow_forward"
        >
          Create Account
        </SubmitButton>

        <div className="flex items-center justify-center gap-1 text-center text-on-surface-variant type-caption-micro">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-[14px] text-primary"
          >
            mail
          </span>
          <span>
            A verification link will be sent to your email address.
          </span>
        </div>
      </div>

      {/* Login */}
      <div className="pt-2 text-center">
        <p className="type-body-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  );
}
