import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, FileText } from "lucide-react";
import Hero from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { Features, HowItWorks, Stats, Testimonials, ProductPreview, FinalCTA } from "@/components/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaxBridge AI — Simplifying global payments & taxes for creators" },
      {
        name: "description",
        content:
          "Automate cross-border tax compliance, track international payments, and get AI-powered tax guidance. Built for freelancers and digital nomads.",
      },
    ],
  }),
  component: Landing,
});

const plans = [
  { name: "Free", price: "$0", desc: "For creators getting started.", features: ["Income tracking", "Basic tax estimate", "Up to 20 documents", "Email alerts"] },
  { name: "Pro", price: "$12", desc: "Everything you need to scale globally.", features: ["Unlimited income & docs", "AI Tax Assistant", "Multi-country compliance", "Priority filing reminders", "Export to accountants"], highlight: true },
];

function Landing() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <ProductPreview />
      <Testimonials />

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-28">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Simple, honest pricing</h2>
          <p className="mt-4 text-white/60">Start free. Upgrade when you grow.</p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 120}>
              <div
                className={`relative h-full rounded-3xl border p-8 backdrop-blur-xl transition hover:-translate-y-1 ${
                  p.highlight
                    ? "border-violet-400/40 bg-gradient-to-br from-violet-600/20 to-fuchsia-500/10 shadow-[0_0_50px_rgba(124,58,237,0.35)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {p.highlight && (
                  <span className="absolute right-6 top-6 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">Most popular</span>
                )}
                <h3 className="font-display text-2xl font-bold text-white">{p.name}</h3>
                <p className="mt-1 text-sm text-white/60">{p.desc}</p>
                <div className="mt-6 flex items-baseline gap-1 text-white">
                  <span className="font-display text-5xl font-bold">{p.price}</span>
                  <span className="text-white/55">/mo</span>
                </div>
                <ul className="mt-7 space-y-3 text-sm text-white/80">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className={`mt-8 block rounded-xl px-5 py-3 text-center text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] ${
                    p.highlight
                      ? "bg-[#7c3aed] text-white shadow-[0_0_25px_rgba(124,58,237,0.6)] hover:bg-[#8b5cf6]"
                      : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  Get {p.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCTA />

      <footer className="border-t border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">TaxBridge AI</span>
          </div>
          <p className="text-xs text-white/50">© 2026 TaxBridge AI. Built for global creators.</p>
          <div className="flex gap-5 text-xs text-white/50">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
