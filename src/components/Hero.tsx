import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Globe, Check } from "lucide-react";

const ROTATING = ["For freelancers", "For digital nomads", "For remote workers", "For global creators"];

function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = ROTATING[idx];
    const speed = deleting ? 35 : 70;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = full.slice(0, text.length + 1);
        setText(next);
        if (next === full) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = full.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIdx((i) => (i + 1) % ROTATING.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx]);

  return (
    <span className="inline-flex items-center font-display text-xl md:text-2xl text-white/80">
      <span>{text}</span>
      <span className="ml-1 inline-block h-6 w-[2px] bg-white/80 animate-caret md:h-7" />
    </span>
  );
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 14,
        opacity: 0.3 + Math.random() * 0.6,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-20px] rounded-full bg-white animate-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: `0 0 ${p.size * 4}px rgba(180,160,255,0.9)`,
          }}
        />
      ))}
    </div>
  );
}

function GlobeVisual() {
  return (
    <div className="relative mx-auto mt-12 h-56 w-56 md:h-72 md:w-72" aria-hidden>
      {/* Glow halo */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.7),transparent_60%)] blur-2xl animate-pulse-glow" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.6),transparent_55%)] blur-2xl" />

      {/* Sphere */}
      <div className="absolute inset-0 animate-spin-slow [transform-style:preserve-3d]">
        <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_0_40px_rgba(139,92,246,0.6)]">
          <defs>
            <radialGradient id="sphere" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#6366f1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="ring" x1="0" x2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="78" fill="url(#sphere)" />
          {/* Latitude lines */}
          {[20, 40, 60, 78, 60, 40, 20].map((r, i) => (
            <ellipse
              key={i}
              cx="100"
              cy={40 + i * 20}
              rx="78"
              ry={r / 6}
              fill="none"
              stroke="url(#ring)"
              strokeOpacity="0.45"
              strokeWidth="0.7"
            />
          ))}
          {/* Longitude lines */}
          {[0, 30, 60, 90, 120, 150].map((a) => (
            <ellipse
              key={a}
              cx="100"
              cy="100"
              rx="22"
              ry="78"
              fill="none"
              stroke="url(#ring)"
              strokeOpacity="0.5"
              strokeWidth="0.7"
              transform={`rotate(${a} 100 100)`}
            />
          ))}
          {/* Dots representing cities */}
          {[
            [70, 80], [130, 60], [110, 130], [60, 120], [150, 110], [90, 50], [140, 150],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.2" fill="#f0abfc" className="animate-pulse" />
          ))}
        </svg>
      </div>

      {/* Orbiting ring */}
      <div className="absolute inset-[-14px] rounded-full border border-white/20 animate-spin-reverse" />
      <div className="absolute inset-[-28px] rounded-full border border-white/10 animate-spin-slow" />
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-[#070418] text-white"
    >
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute -top-1/3 -left-1/4 h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle_at_center,#6d28d9,transparent_60%)] opacity-70 blur-3xl animate-mesh-1" />
        <div className="absolute -bottom-1/3 -right-1/4 h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(circle_at_center,#1d4ed8,transparent_60%)] opacity-70 blur-3xl animate-mesh-2" />
        <div className="absolute top-1/4 right-1/4 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle_at_center,#4f46e5,transparent_55%)] opacity-50 blur-3xl animate-mesh-3" />
        <div className="absolute bottom-1/4 left-1/3 h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle_at_center,#06b6d4,transparent_60%)] opacity-30 blur-3xl animate-mesh-1" />
      </div>

      {/* Grain / noise overlay */}
      <div
        className="absolute inset-0 -z-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <Particles />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
          Built for global creators in Southeast Asia
        </div>

        <h1 className="mt-7 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
          Cross-border taxes,
          <br />
          <span className="bg-gradient-to-r from-white via-violet-200 to-fuchsia-400 bg-clip-text text-transparent">
            solved by AI.
          </span>
        </h1>

        <div className="mt-6 h-9 md:h-10">
          <Typewriter />
        </div>

        <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          TaxBridge AI tracks your international income, estimates your tax in real time, and tells you exactly what to file — so you can focus on the work that pays.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* Glowing animated ring CTA */}
          <div className="relative group">
            <div className="absolute -inset-[2px] rounded-2xl bg-[conic-gradient(from_0deg,#a78bfa,#22d3ee,#ec4899,#a78bfa)] opacity-90 blur-[2px] animate-spin-slow" />
            <div className="absolute -inset-[6px] rounded-2xl bg-[conic-gradient(from_0deg,#a78bfa,#22d3ee,#ec4899,#a78bfa)] opacity-50 blur-xl animate-spin-slow" />
            <Link
              to="/auth"
              className="relative inline-flex items-center gap-2 rounded-2xl bg-[#0b0820] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#120c2e]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            See features
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/60">
          <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-cyan-300" /> 50+ countries</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-300" /> No card required</div>
        </div>

        <GlobeVisual />
      </div>

      {/* Bottom fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
