"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { OtpInput } from "@/components/ui/OtpInput";
import { useVerifyTwoFactor } from "@/lib/hooks/useVerifyTwoFactor";

function VerifyTwoFactorContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");

  const [code, setCode] = useState("");
  const { mutate, isPending, error } = useVerifyTwoFactor();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!challengeId || code.length !== 6 || isPending) {
      return;
    }

    mutate({
      challengeId,
      code,
    });
  };

  const handleCodeChange = (value: string) => {
    // Chiffres uniquement, maximum 6 caractères.
    setCode(value.replace(/\D/g, "").slice(0, 6));
  };

  if (!challengeId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-error-container">
            <Icon name="error" className="text-3xl text-on-error-container" />
          </div>

          <h1 className="text-title-lg font-bold text-on-surface">
            Session invalide
          </h1>

          <p className="mt-2 text-body-md text-on-surface-variant">
            Cette demande de vérification est invalide ou a expiré. Veuillez
            recommencer votre connexion.
          </p>

          <Button
            type="button"
            className="mt-6 w-full"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Retour à la connexion
          </Button>
        </Card>
      </main>
    );
  }

  const handleResendLater = () => {
    // Le renvoi sera connecté à l'API dédiée lorsqu'elle sera exposée
    // dans authApi et dans un hook frontend.
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card variant="elevated" className="p-6 sm:p-8">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <Icon name="mark_email_unread" className="text-4xl text-primary" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-title-xl font-bold text-on-surface">
              Vérification en deux étapes
            </h1>

            <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
              Nous avons envoyé un code de vérification à votre adresse e-mail.
              Saisissez le code à 6 chiffres pour sécuriser votre connexion.
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-4 block text-center text-label-md font-semibold text-on-surface">
                Code de vérification
              </label>

              <OtpInput
                value={code}
                onChange={handleCodeChange}
                disabled={isPending}
                invalid={Boolean(error)}
                length={6}
              />

              <p
                id="otp-description"
                className="mt-3 text-center text-body-sm text-on-surface-variant"
              >
                Entrez les 6 chiffres reçus par e-mail.
              </p>
            </div>

            {/* API Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-error/20 bg-error-container/50 p-3"
              >
                <Icon name="error" className="mt-0.5 text-xl text-error" />

                <p className="text-body-sm text-on-error-container">
                  {error.message ||
                    "Une erreur est survenue lors de la vérification."}
                </p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={code.length !== 6 || isPending}
            >
              {isPending ? (
                <>
                  <Icon
                    name="progress_activity"
                    className="animate-spin text-xl"
                  />
                  Vérification en cours...
                </>
              ) : (
                <>
                  Vérifier le code
                  <Icon name="arrow_forward" className="text-xl" />
                </>
              )}
            </Button>
          </form>

          {/* Resend information */}
          <div className="mt-6 border-t border-outline-variant pt-6 text-center">
            <p className="text-body-sm text-on-surface-variant">
              Vous n&apos;avez pas reçu le code ?
            </p>

            <button
              type="button"
              onClick={handleResendLater}
              disabled
              className="mt-2 text-label-md font-semibold text-primary opacity-60"
            >
              Renvoyer le code
            </button>

            <p className="mt-2 text-body-xs text-on-surface-variant">
              Vérifiez également votre dossier de courriers indésirables.
            </p>
          </div>
        </Card>

        {/* Security notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center">
          <Icon name="lock" className="text-lg text-on-surface-variant" />
          <p className="text-body-xs text-on-surface-variant">
            Votre compte est protégé par une vérification supplémentaire.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function VerifyTwoFactorPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <Icon
            name="progress_activity"
            className="animate-spin text-3xl text-primary"
          />
        </main>
      }
    >
      <VerifyTwoFactorContent />
    </Suspense>
  );
}