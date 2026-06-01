import { Link } from "@tanstack/react-router";
import {
  Bot, TrendingUp, Sparkles, Bell, ArrowRight, Wallet, FileCheck, Brain, Quote,
} from "lucide-react";
import { Reveal, useCountUp } from "./Reveal";

/* ---------- FEATURES BENTO ---------- */
const features = [
  { icon: Bot, title: "AI Tax Assistant", desc: "Conversational guidance on filings, deductions and compliance — tailored to your country.", glow: "rgba(139,92,246,0.55)", span: "lg:col-span-2 lg:row-span-2" },
  { icon: TrendingUp, title: "Income Tracker", desc: "Auto-categorize multi-currency income from global clients in one place.", glow: "rgba(34,211,238,0.5)", span: "" },
  { icon: Sparkles, title: "Real-time Estimator", desc: "Know what you owe before you owe it.", glow: "rgba(59,130,246,0.5)", span: "" },
  { icon: Bell, title: "Compliance Alerts", desc: "Never miss a deadline, document or regulation change.", glow: "rgba(236,72,153,0.5)", span: "lg:col-span-2" },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          Everything you need, <span className="bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-transparent">nothing you don't</span>
        </h2>
        <p className="mt-4 text-white/60">A focused toolkit purpose-built for independent creators working across borders.</p>
      </Reveal>

      <div className="mt-16 grid auto-rows-[200px] gap-5 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 90} className={f.span}>
            <div
              className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/25"
              style={{ ["--glow" as any]: f.glow }}
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: `0 0 40px ${f.glow}, inset 0 0 30px ${f.glow.replace("0.5", "0.15")}` }}
              />
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] transition-transform duration-1000 group-hover:translate-x-full" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 text-white shadow-[0_0_22px_rgba(168,85,247,0.45)] ring-1 ring-white/15">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 font-display text-xl font-semibold text-white">{f.title}</h3>
              <p className="relative mt-2 text-sm text-white/60">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- HOW IT WORKS ---------- */
const steps = [
  { icon: Wallet, title: "Connect Income", desc: "Add clients and link payment sources in seconds." },
  { icon: Brain, title: "AI Analyzes", desc: "We classify income, currencies, and tax exposure across countries." },
  { icon: FileCheck, title: "File Confidently", desc: "Get a ready-to-file summary and timely deadline reminders." },
];

export function HowItWorks() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">How it works</h2>
        <p className="mt-4 text-white/60">Three steps from messy receipts to filed-and-done.</p>
      </Reveal>

      <div className="relative mt-16 grid gap-8 md:grid-cols-3">
        {/* connecting line */}
        <div className="pointer-events-none absolute inset-x-12 top-12 hidden h-px md:block">
          <div className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 animate-[line-grow_1.6s_ease-out_forwards]" />
        </div>
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 220}>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_0_28px_rgba(168,85,247,0.55)]">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="absolute right-5 top-5 font-display text-3xl font-bold text-white/10">0{i + 1}</div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-white/60">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- STATS STRIP ---------- */
function Stat({ value, suffix, label, prefix }: { value: number; suffix?: string; prefix?: string; label: string }) {
  const { ref, value: v } = useCountUp(value);
  return (
    <div className="text-center">
      <div ref={ref} className="font-display text-4xl font-bold text-white md:text-5xl">
        {prefix}{v.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-white/50">{label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Reveal className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
        <Stat value={50} suffix="+" label="Countries" />
        <Stat value={2} suffix="M+" prefix="$" label="Taxes filed" />
        <Stat value={10000} suffix="+" label="Creators" />
        <Stat value={99} suffix="%" label="On-time filings" />
      </Reveal>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}

/* ---------- TESTIMONIALS MARQUEE ---------- */
const testimonials = [
  { name: "Maya R.", role: "Designer", country: "🇮🇩", quote: "I finally understand my taxes. TaxBridge takes the dread out of tax season." },
  { name: "Arjun K.", role: "Developer", country: "🇵🇭", quote: "Multi-currency income tracking alone is worth it. The AI assistant is a game changer." },
  { name: "Lien T.", role: "Writer", country: "🇻🇳", quote: "Simple, beautiful, and actually understands cross-border freelance work." },
  { name: "Sasha P.", role: "Illustrator", country: "🇹🇭", quote: "My accountant asked what tool I use. That says everything." },
  { name: "Daniel O.", role: "Producer", country: "🇸🇬", quote: "Cleaner numbers, faster filings, zero panic." },
  { name: "Hana M.", role: "Consultant", country: "🇲🇾", quote: "Worth every cent. The deadline alerts saved me twice already." },
];

function TCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="mx-3 w-[340px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <Quote className="h-5 w-5 text-violet-300/70" />
      <p className="mt-3 text-sm leading-relaxed text-white/85">"{t.quote}"</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
          {t.name[0]}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{t.name} <span className="ml-1">{t.country}</span></div>
          <div className="text-xs text-white/55">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const loop = [...testimonials, ...testimonials];
  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.25),transparent_60%)] blur-3xl" />
      </div>
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Loved by creators across the region</h2>
        <p className="mt-4 text-white/60">Stories from independents working across borders.</p>
      </Reveal>

      <div className="relative mt-14 group">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent" />
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((t, i) => <TCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- PRODUCT PREVIEW ---------- */
export function ProductPreview() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3),transparent_60%)] blur-3xl" />

      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">A dashboard you'll actually open</h2>
        <p className="mt-4 text-white/60">Real-time income, taxes and alerts — at a glance.</p>
      </Reveal>

      <Reveal delay={150} className="relative mx-auto mt-16 max-w-5xl px-6">
        <div className="relative animate-float">
          {/* Glow under */}
          <div className="absolute -bottom-12 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-violet-600/40 blur-3xl" />
          {/* Browser frame */}
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0c0c14]/90 shadow-[0_30px_80px_-20px_rgba(124,58,237,0.5)] backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <div className="ml-4 flex-1 rounded-md bg-white/5 px-3 py-1 text-center text-[11px] text-white/40">taxbridge.ai/dashboard</div>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              {[
                { label: "YTD Income", value: "$38,450", trend: "+12%" },
                { label: "Tax Estimate", value: "$7,320", trend: "Q2" },
                { label: "Alerts", value: "3", trend: "new" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-wider text-white/50">{s.label}</div>
                  <div className="mt-2 font-display text-2xl font-bold text-white">{s.value}</div>
                  <div className="mt-1 text-xs text-violet-300">{s.trend}</div>
                </div>
              ))}
              <div className="md:col-span-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-xs uppercase tracking-wider text-white/50">Recent transactions</div>
                <div className="mt-3 space-y-2">
                  {["Acme Studios · USA · $2,400", "Northwind Co · UK · £980", "Tokyo Labs · Japan · $1,850"].map((r) => (
                    <div key={r} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-sm text-white/80">
                      <span>{r}</span><span className="text-xs text-emerald-300">received</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          {[
            { text: "AI Tax Estimate", cls: "left-[-2%] top-10", delay: "0s" },
            { text: "Multi-currency", cls: "right-[-2%] top-24", delay: "0.4s" },
            { text: "Deadline alerts", cls: "left-[6%] bottom-8", delay: "0.8s" },
          ].map((c) => (
            <div
              key={c.text}
              className="absolute hidden rounded-full border border-white/15 bg-[#0a0a0f]/80 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_22px_rgba(139,92,246,0.5)] backdrop-blur-xl animate-float md:inline-flex"
              style={{ animationDelay: c.delay, ...({} as any) } as any}
            >
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
              {c.text}
              <span className={`pointer-events-none absolute ${c.cls}`} />
            </div>
          ))}
          <span className="absolute left-[-2%] top-10 hidden rounded-full border border-white/15 bg-[#0a0a0f]/80 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_22px_rgba(139,92,246,0.5)] backdrop-blur-xl md:inline-flex">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-violet-400" /> AI Tax Estimate
          </span>
          <span className="absolute right-[-2%] top-28 hidden rounded-full border border-white/15 bg-[#0a0a0f]/80 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_22px_rgba(34,211,238,0.5)] backdrop-blur-xl md:inline-flex">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" /> Multi-currency
          </span>
          <span className="absolute bottom-8 left-[6%] hidden rounded-full border border-white/15 bg-[#0a0a0f]/80 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_22px_rgba(236,72,153,0.5)] backdrop-blur-xl md:inline-flex">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-fuchsia-400" /> Deadline alerts
          </span>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.35),transparent_60%)]" />
      </div>
      <Reveal className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          <span className="bg-[linear-gradient(110deg,#fff,40%,#c4b5fd,55%,#fff)] bg-[length:200%_100%] bg-clip-text text-transparent animate-[shine_6s_linear_infinite]">
            Stop guessing. Start filing.
          </span>
        </h2>
        <p className="mt-5 text-white/65 md:text-lg">Join thousands of creators who've made cross-border taxes a non-event.</p>
        <div className="mt-10 flex justify-center">
          <Link
            to="/auth"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#7c3aed] px-8 py-4 text-base font-semibold text-white shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-transform duration-200 hover:scale-[1.04] hover:bg-[#8b5cf6] hover:shadow-[0_0_55px_rgba(139,92,246,0.85)]"
          >
            Get Started Free <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
