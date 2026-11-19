"use client";

import { useEffect, useRef, useState } from "react";
import { FeeBreakdown } from "@/components/wallet/FeeBreakdown";

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
/*  Composant principal                                                       */
/* -------------------------------------------------------------------------- */
export function FeeCalculatorSection() {
  const { ref: headerRef, inView: headerInView } = useInView<HTMLDivElement>(0.3);
  const { ref: contentRef, inView: contentInView } = useInView<HTMLDivElement>(0.1);

  return (
    <section className="relative w-full py-20 bg-surface-container-low overflow-hidden">
      {/* ---------- Fond décoratif ---------- */}
      <div
        className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none animate-orb-float-slow"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none animate-orb-float-reverse"
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
          className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700 ease-out ${
            headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Badge "Radical Transparency" */}
          <span className="inline-flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary" />
            </span>
            Radical Transparency
          </span>

          {/* Titre avec dégradé animé sur "Real Time" */}
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-4 mb-3 tracking-tight font-bold">
            Compare Our Fees in{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                Real Time
              </span>
              {/* Soulignement dégradé animé */}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-transform duration-700 ease-out origin-left ${
                  headerInView ? "scale-x-100" : "scale-x-0"
                }`}
                aria-hidden="true"
              />
            </span>
          </h2>

          {/* Sous-titre */}
          <p
            className={`font-body-md text-body-md text-on-surface-variant transition-all duration-700 ease-out ${
              headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            See exactly how much you keep compared to legacy remittance counters and
            traditional mobile network operators.
          </p>
        </div>

        {/* ---------- Contenu : FeeBreakdown ---------- */}
        <div
          ref={contentRef}
          className={`relative transition-all duration-700 ease-out ${
            contentInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {/* Bordure lumineuse subtile autour du contenu */}
          <div
            className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 blur-sm pointer-events-none transition-opacity duration-700"
            style={{ opacity: contentInView ? 0.4 : 0 }}
            aria-hidden="true"
          />

          <div className="relative">
            <FeeBreakdown />
          </div>
        </div>

        {/* ---------- Séparateur dégradé + note de confiance ---------- */}
        <div
          className={`mt-12 flex items-center justify-center gap-4 transition-all duration-700 ease-out ${
            contentInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-outline-variant/40" />
          <span className="font-caption-micro text-caption-micro uppercase tracking-wider text-on-surface-variant">
            Zero hidden fees · Real interbank rates
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-outline-variant/40" />
        </div>
      </div>
    </section>
  );
}