import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const countries = [
  { name: "Philippines", flag: "🇵🇭", treaty: 0.15 },
  { name: "Indonesia", flag: "🇮🇩", treaty: 0.1 },
  { name: "Vietnam", flag: "🇻🇳", treaty: 0.15 },
  { name: "Thailand", flag: "🇹🇭", treaty: 0.05 },
  { name: "India", flag: "🇮🇳", treaty: 0.15 },
];
const sources = [
  { name: "US Stripe", def: 0.3 },
  { name: "Upwork", def: 0.3 },
  { name: "YouTube", def: 0.24 },
  { name: "Wise", def: 0.02 },
];

const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

export function TaxCalculator() {
  const [c, setC] = useState(0);
  const [sel, setSel] = useState<string[]>(["US Stripe", "YouTube"]);
  const [rev, setRev] = useState(4000);

  const active = sources.filter((s) => sel.includes(s.name));
  const defRate = active.length ? active.reduce((a, s) => a + s.def, 0) / active.length : 0;
  const optRate = active.length ? Math.min(defRate, countries[c].treaty * (defRate > 0.05 ? 1 : 0.5)) : 0;
  const annual = rev * 12;
  const lost = annual * defRate;
  const opt = annual * optRate;
  const saved = lost - opt;

  const toggle = (n: string) => setSel((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  return (
    <section id="calculator" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          Calculate your cross-border <span className="text-[#a78bfa]">tax leakage</span>
        </h2>
        <p className="mt-4 text-white/60">See how much default withholding costs you — and what treaty rates could save.</p>
      </Reveal>

      <Reveal delay={120} className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="space-y-7 rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50">Home country</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {countries.map((x, i) => (
                <button key={x.name} onClick={() => setC(i)} aria-pressed={c === i}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${c === i ? "border-violet-400/60 bg-violet-500/20 text-white" : "border-white/10 text-white/60 hover:text-white"}`}>
                  {x.flag} {x.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/50">Payout sources</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {sources.map((s) => (
                <button key={s.name} onClick={() => toggle(s.name)} aria-pressed={sel.includes(s.name)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${sel.includes(s.name) ? "border-cyan-400/60 bg-cyan-500/15 text-white" : "border-white/10 text-white/60 hover:text-white"}`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs uppercase tracking-wider text-white/50">
              <span>Monthly revenue</span><span className="text-white">{fmt(rev)}</span>
            </div>
            <input type="range" min={500} max={20000} step={100} value={rev} onChange={(e) => setRev(+e.target.value)}
              aria-label="Monthly revenue" className="mt-4 w-full accent-violet-500" />
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-600/15 to-fuchsia-500/5 p-7 backdrop-blur-xl shadow-[0_0_50px_rgba(124,58,237,0.25)]">
          {[
            { label: "Default withholding", rate: defRate, val: lost, bar: "bg-red-400/80" },
            { label: "TaxBridge treaty-optimized", rate: optRate, val: opt, bar: "bg-emerald-400/80" },
          ].map((m) => (
            <div key={m.label} className="mb-6">
              <div className="flex justify-between text-sm text-white/70">
                <span>{m.label} · {(m.rate * 100).toFixed(1)}%</span><span className="text-white">{fmt(m.val)}/yr</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full ${m.bar} transition-all duration-500`} style={{ width: `${Math.min(100, m.rate * 300)}%` }} />
              </div>
            </div>
          ))}
          <div className="mt-auto">
            <div className="text-xs uppercase tracking-wider text-white/50">Estimated annual money saved</div>
            <div className="mt-1 font-display text-5xl font-bold text-white">{fmt(saved)}</div>
            <p className="mt-3 flex items-start gap-2 text-xs text-white/55">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Filing a W-8BEN claims your country's treaty rate instead of the default. Estimates only.
            </p>
            <Link to="/auth" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(124,58,237,0.6)] transition hover:scale-[1.03] hover:bg-[#8b5cf6]">
              Lock in these savings <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
