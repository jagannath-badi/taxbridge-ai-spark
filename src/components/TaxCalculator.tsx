import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, TrendingDown } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const countries = [
  { code: "PH", name: "Philippines", treaty: 0.15 },
  { code: "ID", name: "Indonesia", treaty: 0.1 },
  { code: "VN", name: "Vietnam", treaty: 0.3 },
  { code: "TH", name: "Thailand", treaty: 0.05 },
  { code: "IN", name: "India", treaty: 0.15 },
];

const sources = [
  { id: "stripe", name: "US Stripe", base: 0.3 },
  { id: "upwork", name: "Upwork", base: 0.3 },
  { id: "youtube", name: "YouTube", base: 0.3 },
  { id: "wise", name: "Wise", base: 0.04 },
];

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function TaxCalculator() {
  const [country, setCountry] = useState(countries[0]);
  const [active, setActive] = useState<string[]>(["stripe", "youtube"]);
  const [monthly, setMonthly] = useState(4000);

  const { defaultRate, optimizedRate, saved, annual } = useMemo(() => {
    const sel = sources.filter((s) => active.includes(s.id));
    const n = sel.length || 1;
    const def = sel.reduce((a, s) => a + s.base, 0) / n;
    const opt = sel.reduce((a, s) => a + Math.min(s.base, s.base >= 0.3 ? country.treaty : s.base * 0.5), 0) / n;
    const annual = monthly * 12;
    return { defaultRate: sel.length ? def : 0, optimizedRate: sel.length ? opt : 0, saved: sel.length ? annual * (def - opt) : 0, annual };
  }, [active, country, monthly]);

  const toggle = (id: string) =>
    setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  return (
    <section id="calculator" className="mx-auto max-w-6xl px-6 py-28">
      <Reveal className="text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          Calculate your cross-border tax leakage
        </h2>
        <p className="mt-4 text-white/60">See how much default withholding costs you — and what treaty rates could save.</p>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-14 grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:grid-cols-2 md:p-10">
          <div className="space-y-8">
            <div>
              <label htmlFor="calc-country" className="text-xs font-medium uppercase tracking-wider text-white/50">Home country</label>
              <select
                id="calc-country"
                value={country.code}
                onChange={(e) => setCountry(countries.find((c) => c.code === e.target.value)!)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-violet-400/60"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0a0a0f]">{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/50">Payout sources</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sources.map((s) => {
                  const on = active.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(s.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        on ? "border-violet-400/50 bg-violet-500/20 text-white shadow-[0_0_18px_rgba(124,58,237,0.35)]" : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="calc-rev" className="text-xs font-medium uppercase tracking-wider text-white/50">Monthly revenue</label>
                <span className="font-display text-2xl font-bold text-white">{fmt(monthly)}</span>
              </div>
              <input
                id="calc-rev"
                type="range"
                min={500}
                max={30000}
                step={250}
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                className="mt-3 w-full accent-violet-500"
              />
              <div className="mt-1 flex justify-between text-[11px] text-white/40"><span>$500</span><span>$30,000</span></div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-black/30 p-6">
            <div className="space-y-5">
              <Meter label="Default withholding" rate={defaultRate} amount={annual * defaultRate} tone="bg-rose-400" />
              <Meter label={`Treaty-optimized (${country.name})`} rate={optimizedRate} amount={annual * optimizedRate} tone="bg-emerald-400" />
              <p className="flex gap-2 text-xs text-white/50">
                <ShieldCheck className="h-4 w-4 shrink-0 text-violet-300" />
                Filing a W-8BEN claims your country's tax-treaty rate instead of the 30% US default. Estimates only.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-300"><TrendingDown className="h-3.5 w-3.5" /> Estimated annual money saved</p>
              <p className="mt-1 font-display text-4xl font-bold text-white">{fmt(saved)}</p>
            </div>
            <Link
              to="/auth"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all hover:scale-[1.02] hover:bg-[#8b5cf6]"
            >
              Lock in these savings <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Meter({ label, rate, amount, tone }: { label: string; rate: number; amount: number; tone: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-semibold text-white">{(rate * 100).toFixed(1)}% · {fmt(amount)}/yr</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${Math.min(100, (rate / 0.3) * 100)}%` }} />
      </div>
    </div>
  );
}
