import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, TrendingUp, Bell, FileText, Bot, Check } from "lucide-react";
import Hero from "@/components/Hero";

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

const features = [
  { icon: Bot, title: "AI Tax Assistant", desc: "Conversational guidance on filings, deductions and compliance — tailored to your country." },
  { icon: TrendingUp, title: "Income & Payment Tracker", desc: "Auto-categorize multi-currency income from global clients in one place." },
  { icon: Sparkles, title: "Real-time Tax Estimator", desc: "Know what you owe before you owe it. Liabilities update as you earn." },
  { icon: Bell, title: "Compliance Alerts", desc: "Never miss a deadline, document or regulation change again." },
];

const testimonials = [
  { name: "Maya R.", role: "Designer · Bali", quote: "I finally understand my taxes. TaxBridge takes the dread out of tax season." },
  { name: "Arjun K.", role: "Developer · Manila", quote: "Multi-currency income tracking alone is worth it. The AI assistant is a game changer." },
  { name: "Lien T.", role: "Writer · Hanoi", quote: "Simple, beautiful, and actually understands cross-border freelance work." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "For creators getting started.",
    features: ["Income tracking", "Basic tax estimate", "Up to 20 documents", "Email alerts"],
  },
  {
    name: "Pro",
    price: "$12",
    desc: "Everything you need to scale globally.",
    features: ["Unlimited income & docs", "AI Tax Assistant", "Multi-country compliance", "Priority filing reminders", "Export to accountants"],
    highlight: true,
  },
];

function Landing() {
  return (
    <main>
      <Hero />


      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need, <span className="text-gradient">nothing you don't</span>
          </h2>
          <p className="mt-4 text-muted-foreground">A focused toolkit purpose-built for independent creators working across borders.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight">Loved by creators across the region</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
                <p className="text-base leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary font-semibold text-primary-foreground">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </section>


      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight">Simple, honest pricing</h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you grow.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl border p-8 ${
                p.highlight
                  ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                  : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <span className="absolute right-6 top-6 rounded-full bg-background/20 px-3 py-1 text-xs font-medium backdrop-blur">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className={p.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}>/mo</span>
              </div>
              <ul className="mt-7 space-y-3 text-sm">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`mt-8 block rounded-xl px-5 py-3 text-center text-sm font-semibold transition ${
                  p.highlight
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-gradient-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                Get {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">TaxBridge AI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 TaxBridge AI. Built for global creators.</p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
