"use client";

import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { WalletPreview } from "@/components/wallet/WalletPreview";

const TRUST_BADGES = [
  { icon: "shield_locked", title: "Bank-Grade", sub: "256-bit AES" },
  { icon: "fingerprint", title: "Biometric 2FA", sub: "Instant passkeys" },
  { icon: "verified_user", title: "Regulated", sub: "Central bank tier" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Titre animé lettre par lettre                                             */
/* -------------------------------------------------------------------------- */
type AnimatedWordProps = {
  text: string;
  startIndex: number;
  className?: string;
  delay?: number; // ms
  stagger?: number; // ms par lettre
  gradient?: boolean;
};

function AnimatedWord({
  text,
  startIndex,
  delay = 0,
  stagger = 1,
  gradient = false,
}: AnimatedWordProps) {
  return (
    <>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          className={`hero-letter inline-block opacity-0 translate-y-3 ${
            gradient ? "hero-gradient-letter" : ""
          }`}
          style={{ animationDelay: `${delay + (startIndex + i) * stagger}ms` }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

function AnimatedHeroTitle() {
  const DELAY = 150;
  const STAGGER = 28;

  // Calcul des index pour un stagger continu entre les 3 blocs
  const line1 = "Your Money.";
  const line2 = "Smarter, Faster,";
  const line3 = "Borderless.";

  const idx1 = 0;
  const idx2 = line1.length + 1; // +1 pour l'espace
  const idx3 = idx2 + line2.length + 1;

  return (
    <h1
      className="font-display-hero text-display-hero font-black text-on-surface tracking-tighter mb-6 leading-[1.05]"
      aria-label="Your Money. Smarter, Faster, Borderless."
    >
      {/* Ligne 1 */}
      <span className="block sm:inline">
        <AnimatedWord
          text={line1}
          startIndex={idx1}
          delay={DELAY}
          stagger={STAGGER}
        />
      </span>

      {/* <br> responsive — visible dès sm */}
      <br className="hidden sm:inline" />

      {/* Ligne 2 — DÉGRADÉ */}
      <span className="hero-gradient-text inline-block">
        <AnimatedWord
          text={line2}
          startIndex={idx2}
          delay={DELAY}
          stagger={STAGGER}
          gradient
        />
      </span>{" "}

      {/* Ligne 3 */}
      <span className="inline-block">
        <AnimatedWord
          text={line3}
          startIndex={idx3}
          delay={DELAY}
          stagger={STAGGER}
        />
      </span>
    </h1>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hook reveal au scroll                                                     */
/* -------------------------------------------------------------------------- */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

/* -------------------------------------------------------------------------- */
/*  Composant principal                                                       */
/* -------------------------------------------------------------------------- */
export function HeroSection() {
  const { ref: trustRef, inView: trustInView } = useInView<HTMLDivElement>();

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-container-low to-surface py-16 lg:py-24">
      {/* ---------- Fond animé ---------- */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-primary/10 via-secondary/10 to-transparent blur-3xl pointer-events-none rounded-full animate-orb-float"
        aria-hidden="true"
      />
      <div
        className="absolute -top-12 -right-12 w-96 h-96 bg-primary/5 rounded-full blur-2xl pointer-events-none animate-orb-float-slow"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-2xl pointer-events-none animate-orb-float-reverse"
        aria-hidden="true"
      />

      {/* Grille subtile en overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* ---------- Badge ---------- */}
            <div className="hero-reveal" style={{ animationDelay: "0ms" }}>
              <Badge className="mb-6 hover:scale-[1.02] transition-transform duration-300">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
                </span>
                <span className="uppercase tracking-wide">
                  Next-Generation Digital Finance in Madagascar &amp; Beyond
                </span>
              </Badge>
            </div>

            {/* ---------- Titre BOLD animé lettre par lettre ---------- */}
            
            <AnimatedHeroTitle />
            {/* ---------- Paragraphe ---------- */}
            <p
              className="hero-reveal font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed"
              style={{ animationDelay: "1400ms" }}
            >
              Experience instant mobile money transfers, secure multi-currency
              wallets, transparent low fees, and effortless merchant QR payments
              tailored for individuals and high-growth businesses.
            </p>

            {/* ---------- CTA ---------- */}
            <div
              className="hero-reveal flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10"
              style={{ animationDelay: "1600ms" }}
            >
              <ButtonLink
                variant="gradient"
                href="#"
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Open Free Account
                  <Icon
                    name="arrow_forward"
                    className="text-[18px] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </ButtonLink>

              <ButtonLink
                variant="secondary"
                href="#"
                className="group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Icon
                  name="account_balance_wallet"
                  className="text-primary text-[20px] transition-transform duration-300 group-hover:rotate-6"
                />
                Explore Wallet Features
              </ButtonLink>
            </div>

            {/* ---------- Trust badges ---------- */}
            <div
              ref={trustRef}
              className={`grid grid-cols-3 gap-3 sm:gap-6 pt-6 w-full max-w-xl bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-4 shadow-sm transition-all duration-700 ${
                trustInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              {TRUST_BADGES.map((badge, i) => (
                <div
                  key={badge.title}
                  className="group flex items-center gap-2 sm:gap-3 transition-transform duration-300 hover:-translate-y-0.5 cursor-default"
                  style={{
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-on-primary group-hover:scale-110 group-hover:rotate-3">
                    <Icon name={badge.icon} className="text-[18px] sm:text-[20px]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-sm text-label-sm font-bold text-on-surface truncate">
                      {badge.title}
                    </p>
                    <p className="font-caption-micro text-caption-micro text-on-surface-variant truncate">
                      {badge.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- WalletPreview (wrapper avec fade + float) ---------- */}
          <div
            className="lg:col-span-5 hero-reveal"
            style={{ animationDelay: "600ms" }}
          >
            <div className="animate-float">
              <WalletPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}