
"use client";

export function RecoveryMethodPicker() {
  return (
    <div className="mb-2">
      <div className="w-full rounded-2xl bg-surface-container-low p-4 sm:p-5 shadow-sm">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-primary text-on-primary shadow-sm">
            <span
              className="material-symbols-outlined text-[24px]"
              aria-hidden="true"
            >
              mark_email_read
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="type-headline-sm text-on-surface">
                Email Reset Link
              </h3>

              <span className="px-2 py-0.5 rounded-full type-label-sm uppercase tracking-wide bg-primary-fixed text-on-primary-fixed-variant">
                Secure Recovery
              </span>
            </div>

            <p className="type-body-sm text-on-surface-variant">
              Receive a secure password reset link at your
              registered email address.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span
                className="material-symbols-outlined text-[18px] text-primary"
                aria-hidden="true"
              >
                verified_user
              </span>

              <span className="type-label-md text-on-surface font-medium">
                Email verification required
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="shrink-0 mt-1">
            <span
              className="material-symbols-outlined text-primary text-[22px]"
              aria-label="Selected recovery method"
            >
              check_circle
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
