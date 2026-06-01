import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0a0a0f] text-white">
      {/* Subtle corner radials */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(76,29,149,0.35),transparent_60%)] blur-3xl" />
        <div className="absolute -top-40 -right-40 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(30,27,75,0.5),transparent_60%)] blur-3xl" />
      </div>

      {/* Thin glowing divider under navbar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent shadow-[0_0_18px_rgba(168,85,247,0.5)]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center reveal">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          Built for global creators in Southeast Asia
        </div>

        <h1 className="mt-7 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-[5.5rem]">
          Cross-border taxes,
          <br />
          solved by <span className="text-[#a78bfa]">AI</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-white/60 md:text-lg">
          TaxBridge AI tracks your international income, estimates your tax in real time, and tells you exactly what to file — so you can focus on the work that pays.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/auth"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.45)] transition-transform duration-200 hover:scale-[1.03] hover:bg-[#8b5cf6] hover:shadow-[0_0_40px_rgba(139,92,246,0.65)]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-transparent px-6 py-3.5 text-sm font-semibold text-white/85 transition-transform duration-200 hover:scale-[1.03] hover:border-white/30 hover:bg-white/5"
          >
            See Features
          </a>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50">
          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> 50+ countries</div>
          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> No card required</div>
          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> 2-minute setup</div>
        </div>
      </div>
    </section>
  );
}
