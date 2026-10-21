"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const SUB_FEATURES = [
  { icon: "verified", title: "Zero Hidden Charges", sub: "Real-time preview of exact recipient figures." },
  { icon: "autorenew", title: "Inter-Operator Hub", sub: "Native bridging between mobile carriers." },
] as const;

const COMPLIANCE = [
  { icon: "lock", title: "PCI-DSS Level 1", sub: "Strict financial payment transaction vaulting.", tone: "text-primary" },
  { icon: "encrypted", title: "End-to-End HSM", sub: "Hardware security module signing keys.", tone: "text-secondary" },
  { icon: "policy", title: "AML/CFT Screen", sub: "Real-time anti-fraud transaction filter.", tone: "text-primary" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Hook reveal au scroll                                                     */
/* -------------------------------------------------------------------------- */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* -------------------------------------------------------------------------- */
/*  Wrapper réutilisable pour les cards (reveal + hover)                     */
/* -------------------------------------------------------------------------- */
type RevealCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  inView: boolean;
};

function RevealCard({ children, className = "", delay = 0, inView }: RevealCardProps) {
  return (
    <article
      className={`group relative bg-surface-container-lowest rounded-2xl p-8 shadow-sm flex flex-col justify-between
        overflow-hidden transition-all duration-700 ease-out
        hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Halo hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.04]" />

      {/* Shine sweep */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* Bordure dégradée subtile au hover */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/10 transition-colors duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {children}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Icône animée dans un carré                                                */
/* -------------------------------------------------------------------------- */
function FeatureIcon({
  name,
  tone = "text-primary",
  inView,
  delay = 0,
}: {
  name: string;
  tone?: string;
  inView: boolean;
  delay?: number;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container ${tone} mb-6
        transition-all duration-500
        group-hover:scale-110 group-hover:rotate-3 group-hover:bg-surface-container-high
        ${inView ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      style={{ transitionDelay: `${delay + 150}ms` }}
    >
      <Icon name={name} className="text-[26px] transition-transform duration-300 group-hover:scale-110" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Graphique SVG animé (path qui se dessine)                                */
/* -------------------------------------------------------------------------- */
function AnimatedChart({ inView }: { inView: boolean }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <svg className="w-full h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 240 40">
      <path
        ref={pathRef}
        d="M0 32 L35 28 L70 33 L110 18 L150 22 L190 10 L240 14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        style={{
          strokeDasharray: length,
          strokeDashoffset: inView ? 0 : length,
          transition: "stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
        }}
      />
      <path
        d="M0 32 L35 28 L70 33 L110 18 L150 22 L190 10 L240 14 V40 H0 Z"
        fill="currentColor"
        fillOpacity={inView ? 0.08 : 0}
        stroke="none"
        style={{ transition: "fill-opacity 1s ease 1.2s" }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Composant principal                                                       */
/* -------------------------------------------------------------------------- */
export function FeaturesSection() {
  const { ref: headerRef, inView: headerInView } = useInView<HTMLDivElement>(0.3);
  const { ref: gridRef, inView: gridInView } = useInView<HTMLDivElement>(0.1);

  return (
    <section className="relative w-full py-20 lg:py-28 bg-surface overflow-hidden">
      {/* Orbes décoratifs */}
      <div
        className="absolute top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Grille subtile */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* ---------- Header ---------- */}
        <div
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ease-out ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Engineered For Sovereignty
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-3 mb-4 tracking-tight font-bold">
            The Unified Engine for{" "}
            <span className="bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent">
              Modern African Capital
            </span>
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Built from ground up to solve cross-border friction, fragmented mobile money
            silos, and prohibitive transaction fees.
          </p>
        </div>

        {/* ---------- Grid ---------- */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* ===================================================== */}
          {/* 1. Instant Money Movement                            */}
          {/* ===================================================== */}
          <RevealCard className="md:col-span-7" delay={0} inView={gridInView}>
            <div>
              <FeatureIcon name="flash_on" inView={gridInView} delay={0} />
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-3">
                Instant Money Movement
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-6 leading-relaxed">
                Send and receive funds in seconds with absolute precision. Connect directly
                across Orange Money, Airtel Money, MVola, and global bank accounts without
                standard middleman latency.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {SUB_FEATURES.map((f, i) => (
                  <div
                    key={f.title}
                    className="p-4 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container hover:-translate-y-0.5 cursor-default"
                    style={{
                      opacity: gridInView ? 1 : 0,
                      transform: gridInView ? "translateY(0)" : "translateY(8px)",
                      transitionDelay: `${400 + i * 100}ms`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={f.icon} className="text-primary text-[18px]" />
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                        {f.title}
                      </span>
                    </div>
                    <p className="font-caption-micro text-caption-micro text-on-surface-variant">
                      {f.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image avec overlay animé */}
            <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden mt-2 group/img">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                alt="A modern professional businesswoman in a sunlit high-tech office in Antananarivo using a sleek smartphone to verify instantaneous mobile payment confirmations."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ6S5Olrv_-U-OOXOmDhrkr9Q6DM0JCUL33sXdWPZv-GHrb-Qma-RsjvogcdMHzzLpLfEU2jP2cGbyX3FrupqwvxllU_nypn4FoHm1-u3sui4LaYaqBP-9XhDprrRZHkcAstMEiDc7Ez0NMTNE0JLex82fFZi42xG4nonB7o6Wzq8xV_kJJIw4N-cKJAHniVVHQQZyCDoONBfQSasHzZb50QZoyJQjs8ZbRhO5b2-59haqJa8GewM6"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex items-end p-4">
                <span className="font-label-sm text-label-sm text-inverse-on-surface font-medium flex items-center gap-2">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-secondary opacity-75 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-secondary" />
                  </span>
                  Instant settlement across 18 regional clearing houses
                </span>
              </div>
            </div>
          </RevealCard>

          {/* ===================================================== */}
          {/* 2. Multi-Currency Freedom                            */}
          {/* ===================================================== */}
          <RevealCard className="md:col-span-5" delay={150} inView={gridInView}>
            <div>
              <FeatureIcon name="public" tone="text-secondary" inView={gridInView} delay={150} />
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-3">
                Multi-Currency Freedom
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                Hold MGA, EUR, and USD simultaneously. Lock in real interbank mid-market
                exchange rates without predatory bank markups.
              </p>

              <div className="space-y-3 mb-6 bg-surface-container-low p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                    EUR / MGA
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-bold tabular-nums">
                    4,925.40 Ar
                  </span>
                </div>

                <AnimatedChart inView={gridInView} />

                <div className="flex items-center justify-between">
                  <span className="font-caption-micro text-caption-micro text-on-surface-variant">
                    Live feed updated 2m ago
                  </span>
                  <span className="font-caption-micro text-caption-micro text-secondary font-medium">
                    +0.42% Daily
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-high/60 flex items-center justify-between transition-all duration-300 hover:bg-surface-container-high cursor-default">
              <div className="flex items-center gap-3">
                <Icon name="swap_horiz" className="text-primary text-[22px] transition-transform duration-500 group-hover:rotate-180" />
                <span className="font-label-sm text-label-sm font-medium text-on-surface">
                  One-Tap Conversion
                </span>
              </div>
              <span className="font-caption-micro text-caption-micro uppercase px-2 py-1 rounded bg-surface-container-lowest font-bold text-on-surface">
                0.2% Flat
              </span>
            </div>
          </RevealCard>

          {/* ===================================================== */}
          {/* 3. Merchant Solutions                                */}
          {/* ===================================================== */}
          <RevealCard className="md:col-span-5" delay={250} inView={gridInView}>
            <div>
              <FeatureIcon name="storefront" inView={gridInView} delay={250} />
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-3">
                Merchant &amp; Business Solutions
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                Equip your retail storefront or digital SaaS with dynamic QR codes,
                webhook APIs, and corporate sub-wallets.
              </p>
              <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 mb-4 transition-all duration-300 hover:bg-surface-container">
                <div className="w-20 h-20 bg-surface-container-lowest rounded-lg flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                  <Icon name="qr_code_2" className="text-[48px] text-on-surface" />
                </div>
                <div className="min-w-0">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface block">
                    Dynamic Checkout QR
                  </span>
                  <p className="font-caption-micro text-caption-micro text-on-surface-variant mt-0.5">
                    Compatible with standard camera scanners &amp; banking apps.
                  </p>
                  <div className="inline-flex items-center gap-1 mt-2 text-primary font-caption-micro text-caption-micro font-semibold">
                    <Icon name="bolt" className="text-[14px]" />
                    Instant webhook confirmation
                  </div>
                </div>
              </div>
            </div>
            <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-center gap-2 transition-colors duration-300 hover:text-on-surface">
                <Icon name="check_circle" className="text-primary text-[18px] shrink-0" />
                Automated tax invoices compliant with Malagasy DGI
              </li>
              <li className="flex items-center gap-2 transition-colors duration-300 hover:text-on-surface">
                <Icon name="check_circle" className="text-primary text-[18px] shrink-0" />
                Multi-user permissions with role-based segregation
              </li>
            </ul>
          </RevealCard>

          {/* ===================================================== */}
          {/* 4. Institutional Custody                             */}
          {/* ===================================================== */}
          <RevealCard className="md:col-span-7" delay={350} inView={gridInView}>
            <div>
              <FeatureIcon name="security" tone="text-secondary" inView={gridInView} delay={350} />
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-3">
                Institutional Grade Custody
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-6 leading-relaxed">
                Funds are ring-fenced in tier-one partner banking institutions. Automated
                continuous auditing protects user balances from counterparty insolvency.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {COMPLIANCE.map((c, i) => (
                <div
                  key={c.title}
                  className="p-4 rounded-xl bg-surface-container-low transition-all duration-300 hover:bg-surface-container hover:-translate-y-0.5 cursor-default"
                  style={{
                    opacity: gridInView ? 1 : 0,
                    transform: gridInView ? "translateY(0)" : "translateY(8px)",
                    transitionDelay: `${600 + i * 100}ms`,
                  }}
                >
                  <Icon name={c.icon} className={`${c.tone} mb-2`} />
                  <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                    {c.title}
                  </p>
                  <p className="font-caption-micro text-caption-micro text-on-surface-variant mt-1">
                    {c.sub}
                  </p>
                </div>
              ))}
            </div>
          </RevealCard>
        </div>
      </div>
    </section>
  );
}