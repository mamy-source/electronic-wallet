"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    value: "120K+",
    label: "Active Accounts",
    tone: "text-primary",
    accent: "bg-primary",
    glow: "shadow-primary/20",
    progress: 92,
  },
  {
    value: "38B Ar",
    label: "Processed Volume",
    tone: "text-secondary",
    accent: "bg-secondary",
    glow: "shadow-secondary/20",
    progress: 78,
  },
  {
    value: "99.98%",
    label: "Uptime Availability",
    tone: "text-on-surface",
    accent: "bg-on-surface",
    glow: "shadow-on-surface/10",
    progress: 99,
  },
  {
    value: "< 1 sec",
    label: "Settlement Velocity",
    tone: "text-primary",
    accent: "bg-primary",
    glow: "shadow-primary/20",
    progress: 96,
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Hook reveal au scroll                                                     */
/* -------------------------------------------------------------------------- */
function useInView<T extends HTMLElement>(threshold = 0.2) {
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
/*  Compteur animé (respecte les suffixes : K+, B Ar, %, <, sec, etc.)       */
/* -------------------------------------------------------------------------- */
function useCountUp(target: string, inView: boolean, duration = 1600) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!inView) {
      setDisplay(target);
      return;
    }

    // On ne compte que si le premier caractère est un chiffre
    const match = target.match(/^([\d.]+)(.*)$/);
    if (!match) {
      // valeur comme "< 1 sec" — pas de compteur, juste fade
      setDisplay(target);
      return;
    }

    const [, numStr, suffix] = match;
    const targetNum = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const current = targetNum * eased;
      setDisplay(`${current.toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration]);

  return display;
}

/* -------------------------------------------------------------------------- */
/*  Card individuelle                                                         */
/* -------------------------------------------------------------------------- */
type StatCardProps = {
  stat: (typeof STATS)[number];
  index: number;
  inView: boolean;
};

function StatCard({ stat, index, inView }: StatCardProps) {
  const displayValue = useCountUp(stat.value, inView, 1600 + index * 120);

  return (
    <div
      className={`group relative p-5 sm:p-6 bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden
        transition-all duration-500 ease-out cursor-default
        hover:-translate-y-1 hover:shadow-lg ${stat.glow}
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Halo dégradé au hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      {/* Shine sweep au hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {/* Contenu */}
      <div className="relative z-10">
        <p
          className={`font-balance-numeral-md text-balance-numeral-md font-bold tabular-nums ${stat.tone} transition-transform duration-300 group-hover:scale-105 origin-left`}
        >
          {displayValue}
        </p>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
          {stat.label}
        </p>

        {/* Barre de progression animée */}
        <div className="mt-4 h-1 w-full rounded-full bg-surface-container-high overflow-hidden">
          <div
            className={`h-full ${stat.accent} rounded-full transition-all duration-[1400ms] ease-out`}
            style={{
              width: inView ? `${stat.progress}%` : "0%",
              transitionDelay: `${index * 100 + 300}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Composant principal                                                       */
/* -------------------------------------------------------------------------- */
export function StatsBar() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="relative w-full bg-surface-container-low py-10 shadow-inner overflow-hidden">
      {/* Orbes décoratifs */}
      <div
        className="absolute -top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center"
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}