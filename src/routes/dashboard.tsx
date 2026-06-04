import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  TrendingUp, Wallet, AlertTriangle, FileUp, Send, Bot, Bell, ArrowUpRight, ArrowDownRight, Calendar, X, FileText, Sparkles, Loader2,
} from "lucide-react";
import { useSession } from "../lib/session";
import { AISmartSummary } from "../components/AISmartSummary";
import { streamChat } from "../lib/streamChat";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TaxBridge AI" },
      { name: "description", content: "Track income, taxes, and compliance in one place." },
    ],
  }),
  component: Dashboard,
});

const transactions = [
  { id: 1, client: "Acme Studios", country: "USA", amount: 2400, currency: "USD", date: "Apr 28", type: "in" },
  { id: 2, client: "Northwind Co", country: "UK", amount: 980, currency: "GBP", date: "Apr 22", type: "in" },
  { id: 3, client: "Tax Withholding", country: "—", amount: 320, currency: "USD", date: "Apr 20", type: "out" },
  { id: 4, client: "Maple Agency", country: "Canada", amount: 1500, currency: "CAD", date: "Apr 14", type: "in" },
  { id: 5, client: "Tokyo Labs", country: "Japan", amount: 1850, currency: "USD", date: "Apr 08", type: "in" },
];

const alerts = [
  { id: 1, severity: "high", title: "Q2 estimated tax due in 14 days", date: "Jun 15" },
  { id: 2, severity: "medium", title: "Missing invoice for Northwind Co", date: "Apr 22" },
  { id: 3, severity: "low", title: "New regulation: SG GST update", date: "May 01" },
];

type Msg = { role: "user" | "ai"; text: string };

function Dashboard() {
  const { user } = useSession();
  const [docs, setDocs] = useState<{ name: string; size: number }[]>([
    { name: "Invoice-Acme-Apr.pdf", size: 184320 },
    { name: "Receipt-Office.png", size: 56123 },
  ]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: `Hi ${user?.name?.split(" ")[0] ?? "there"} 👋 I'm your tax assistant. Ask me anything about your filings, deductions, or deadlines.` },
  ]);
  const [input, setInput] = useState("");

  if (!user) return <Navigate to="/auth" />;

  const totalIncome = 38450;
  const taxEstimate = 7320;
  const taxRate = ((taxEstimate / totalIncome) * 100).toFixed(1);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setDocs((prev) => [...prev, ...Array.from(files).map((f) => ({ name: f.name, size: f.size }))]);
  };

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: `Based on your profile in ${user.country}, "${q.slice(0, 40)}..." — here's a quick take: keep records for 5 years, set aside ~${taxRate}% of income, and file quarterly estimates to avoid penalties. Want me to draft a checklist?`,
        },
      ]);
    }, 700);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{user.name}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> Tax year 2026 · {user.country}
        </div>
      </div>

      {/* AI Smart Summary */}
      <AISmartSummary country={user.country} totalIncome={totalIncome} taxEstimate={taxEstimate} />

      {/* Overview cards */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Stat icon={Wallet} label="Total Income (YTD)" value={`$${totalIncome.toLocaleString()}`} delta="+12.4%" trend="up" />
        <Stat icon={TrendingUp} label="Estimated Tax" value={`$${taxEstimate.toLocaleString()}`} delta={`${taxRate}% rate`} trend="neutral" />
        <Stat icon={AlertTriangle} label="Active Alerts" value={`${alerts.length}`} delta="1 high priority" trend="down" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Transactions */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent transactions</h2>
            <button className="text-xs font-medium text-primary hover:underline">View all</button>
          </div>
          <div className="divide-y divide-border">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${t.type === "in" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                    {t.type === "in" ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.client}</p>
                    <p className="text-xs text-muted-foreground">{t.country} · {t.date}</p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${t.type === "in" ? "text-foreground" : "text-destructive"}`}>
                  {t.type === "in" ? "+" : "−"}{t.amount.toLocaleString()} {t.currency}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alerts */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-semibold">Alerts</h2>
          </div>
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li key={a.id} className="rounded-xl border border-border bg-background p-3.5">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-1 inline-block h-2 w-2 shrink-0 rounded-full ${
                      a.severity === "high" ? "bg-destructive" : a.severity === "medium" ? "bg-warning" : "bg-teal"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* AI Assistant */}
        <section className="flex flex-col rounded-2xl border border-border bg-card shadow-soft lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-border px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">AI Tax Assistant</h2>
              <p className="text-xs text-muted-foreground">Ask anything about your taxes</p>
            </div>
          </div>
          <div className="flex max-h-80 min-h-64 flex-1 flex-col gap-3 overflow-y-auto p-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="e.g. How much should I save for taxes?"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <button onClick={send} className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground transition hover:scale-105">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Documents</h2>
          <p className="mt-1 text-xs text-muted-foreground">Invoices, receipts, tax forms.</p>

          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 py-6 text-center text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
          >
            <FileUp className="h-5 w-5" />
            Click to upload
            <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </button>

          <ul className="mt-4 space-y-2">
            {docs.map((d, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-background p-2.5 text-xs">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <div className="flex-1 truncate">
                  <p className="truncate font-medium">{d.name}</p>
                  <p className="text-muted-foreground">{(d.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => setDocs((p) => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon, label, value, delta, trend,
}: { icon: React.ElementType; label: string; value: string; delta: string; trend: "up" | "down" | "neutral" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-primary opacity-10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
          <p className={`mt-1 text-xs font-medium ${trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
            {delta}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
