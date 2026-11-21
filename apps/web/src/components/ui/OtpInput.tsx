"use client";

import {
  useRef,
  type ClipboardEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  length?: number;
};

export function OtpInput({
  value,
  onChange,
  disabled = false,
  invalid = false,
  length = 6,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index));
    inputsRef.current[clamped]?.focus();
    inputsRef.current[clamped]?.select();
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, "");
    if (!digits) return;

    const chars = value.split("");

    // Support du collage / saisie multiple rapide
    for (let i = 0; i < digits.length && index + i < length; i++) {
      chars[index + i] = digits[i];
    }

    const next = chars.join("").slice(0, length);
    onChange(next);

    const nextFocus = Math.min(index + digits.length, length - 1);
    focusIndex(nextFocus);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const chars = value.split("");

      if (chars[index]) {
        chars[index] = "";
        onChange(chars.join(""));
      } else if (index > 0) {
        chars[index - 1] = "";
        onChange(chars.join(""));
        focusIndex(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusIndex(index - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    onChange(pasted);
    focusIndex(pasted.length - 1);
  };

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="Code de vérification à 6 chiffres"
    >
      {Array.from({ length }).map((_, index) => {
        const char = value[index] ?? "";
        const isActive = char !== "";

        return (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={char}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Chiffre ${index + 1} sur ${length}`}
            aria-invalid={invalid}
            className={[
              "h-14 w-12 sm:h-16 sm:w-14",
              "rounded-xl border-2 bg-surface-container-lowest",
              "text-center font-mono text-2xl font-bold text-on-surface",
              "outline-none transition-all duration-150",
              "caret-transparent selection:bg-primary/20",
              invalid
                ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                : isActive
                  ? "border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  : "border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}