"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@electronic-wallet/validation";
import type { LoginInput } from "@electronic-wallet/validation";
import { useLogin } from "@/lib/hooks/use-login";
import { FormField } from "../FormField";
import { SubmitButton } from "../SubmitButton";
import { ServerError } from "../ServerError";
import { FastLoginRow } from "./FastLoginRow";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = (data: LoginInput) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <FastLoginRow
        onPasskey={() => alert("WebAuthn not wired yet")}
        onMvola={() => alert("MVola SIM push not wired yet")}
      />

      <div className="relative flex items-center justify-center my-0.5">
        <div className="w-full h-px bg-surface-container-high" />
        <span className="absolute bg-surface-container-lowest px-3 type-caption-micro text-outline font-semibold uppercase tracking-wider">
          Or standard credentials
        </span>
      </div>

      <ServerError message={error?.message} />

      <FormField
        label="Email"
        placeholder="name@domain.com"
        leftIcon="person"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="type-label-sm text-on-surface">Password</label>
          <a href="/forgot-password" className="type-label-sm text-primary hover:text-primary-container font-semibold flex items-center gap-0.5">
            Forgot password?
            <Icon name="arrow_forward" className="text-[14px]" />
          </a>
        </div>
        <div className="relative flex items-center">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your security password"
            className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-surface-container-lowest type-body-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 p-1 rounded-lg text-outline hover:text-on-surface"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-[20px]" />
          </button>
        </div>
        {errors.password && (
          <p className="type-caption-micro text-error">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded accent-primary cursor-pointer"
            {...register("rememberMe")}
          />
          <span className="type-body-sm text-on-surface-variant font-medium">
            Remember this device for 30 days
          </span>
        </label>
        <span className="type-caption-micro text-tertiary hidden sm:inline">Encrypted token</span>
      </div>

      <div className="pt-1 flex flex-col gap-2">
        <SubmitButton loading={isPending} icon="login">
          Sign In to MONEXA
        </SubmitButton>
        <div className="text-center pt-1">
          <p className="type-body-sm text-on-surface-variant">
            Don&apos;t have a MONEXA account yet?{" "}
            <a href="/register" className="font-semibold text-primary hover:text-primary-container ml-1 inline-flex items-center gap-0.5">
              Create an account
              <Icon name="open_in_new" className="text-[14px]" />
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}