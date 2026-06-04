import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  TrendingUp, Wallet, AlertTriangle, FileUp, Send, Bot, Bell, ArrowDownRight, Calendar, X, FileText, Sparkles, Loader2, Plus,
} from "lucide-react";
import { useSession } from "../lib/session";
import { AISmartSummary } from "../components/AISmartSummary";
import { streamChat } from "../lib/streamChat";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TaxBridge AI" },
      { name: "description", content: "Track income, taxes, and compliance in one place." },
    ],
  }),
  component: Dashboard,
});

type Msg = { role: "user" | "ai"; text: string };
type Income = {
  id: string;
  platform_name: string;
  amount: number;
  currency: string;
  country_of_source: string | null;
  income_date: string;
  category: string | null;
};
type Doc = {
  id: string;
  file_name: string;
  file_url: string | null;
  parse_status: string;
  parsed_data: any;
  uploaded_at: string;
  size?: number;
  insight?: string;
  parsing?: boolean;
};
type Alert = { id: string; message: string; due_date: string | null; is_read: boolean };

function Dashboard() {
  const { user, userId, loading } = useSession();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [uploading, setUploading] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const refresh = useCallback(async () => {
    if (!userId) return;
    const [i, d, a] = await Promise.all([
      supabase.from("income_sources").select("*").order("income_date", { ascending: false }),
      supabase.from("documents").select("*").order("uploaded_at", { ascending: false }),
      supabase.from("tax_alerts").select("*").order("created_at", { ascending: false }),
    ]);
    if (i.data) setIncomes(i.data as any);
    if (d.data) setDocs(d.data as any);
    if (a.data) setAlerts(a.data as any);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    refresh();
    // seed welcome message after user loads
    setMessages([{ role: "ai", text: `Hi ${user?.name?.split(" ")[0] ?? "there"} 👋 I'm your tax assistant. Ask me anything about your filings, deductions, or deadlines.` }]);
    // seed an alert if none exist (one-time per user session)
    (async () => {
      const { count } = await supabase.from("tax_alerts").select("*", { count: "exact", head: true });
      if ((count ?? 0) === 0) {
        await supabase.from("tax_alerts").insert([
          { user_id: userId, message: "Q2 estimated tax due in 14 days", due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10) },
          { user_id: userId, message: "Welcome! Add your first income source to get a tax estimate.", due_date: null },
        ]);
        refresh();
      }
    })();
  }, [userId, user?.name, refresh]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      </main>
    );
  }
  if (!userId || !user) return <Navigate to="/auth" />;

  const totalIncome = incomes.reduce((s, x) => s + Number(x.amount), 0);
  const taxEstimate = Math.round(totalIncome * 0.19);
  const taxRate = totalIncome > 0 ? ((taxEstimate / totalIncome) * 100).toFixed(1) : "0";

  const parseDoc = async (doc: Doc) => {
    setDocs((p) => p.map((x) => (x.id === doc.id ? { ...x, parsing: true, insight: "" } : x)));
    try {
      let acc = "";
      await streamChat({
        messages: [
          { role: "system", content: "You are an AI document parser for a tax app. Given only a filename, infer the likely document type, fields it contains, and 1 concrete tax-relevant action. 2 short sentences max." },
          { role: "user", content: `Filename: ${doc.file_name}. Country: ${user.country}.` },
        ],
        onToken: (t) => {
          acc += t;
          setDocs((p) => p.map((x) => (x.id === doc.id ? { ...x, insight: (x.insight ?? "") + t } : x)));
        },
      });
      await supabase.from("documents").update({ parse_status: "parsed", parsed_data: { insight: acc } }).eq("id", doc.id);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to parse document");
    } finally {
      setDocs((p) => p.map((x) => (x.id === doc.id ? { ...x, parsing: false } : x)));
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !userId) return;
    setUploading(files.length);
    const inserted: Doc[] = [];
    for (const f of Array.from(files)) {
      const path = `${userId}/${Date.now()}-${f.name}`;
      const { error: upErr } = await supabase.storage.from("user-documents").upload(path, f);
      if (upErr) {
        toast.error(`Upload failed: ${f.name}`);
        setUploading((u) => u - 1);
        continue;
      }
      const { data: rec, error: insErr } = await supabase
        .from("documents")
        .insert({ user_id: userId, file_name: f.name, file_url: path, parse_status: "pending" })
        .select()
        .single();
      if (!insErr && rec) inserted.push({ ...(rec as any), size: f.size });
      setUploading((u) => u - 1);
    }
    if (inserted.length) {
      setDocs((p) => [...inserted, ...p]);
      toast("AI is analyzing your documents…", { icon: <Sparkles className="h-4 w-4 text-violet-300" /> });
      inserted.forEach((d, i) => setTimeout(() => parseDoc(d), 300 + i * 200));
    }
  };

  const removeDoc = async (d: Doc) => {
    await supabase.from("documents").delete().eq("id", d.id);
    if (d.file_url) await supabase.storage.from("user-documents").remove([d.file_url]);
    setDocs((p) => p.filter((x) => x.id !== d.id));
  };

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "ai", text: `Based on your profile in ${user.country}, "${q.slice(0, 40)}..." — keep records for 5 years, set aside ~${taxRate}% of income, and file quarterly estimates. Want me to draft a checklist?` },
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowIncomeForm(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]"
          >
            <Plus className="h-4 w-4" /> Add Income
          </button>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> Tax year 2026 · {user.country}
          </div>
        </div>
      </div>

      <AISmartSummary country={user.country} totalIncome={totalIncome} taxEstimate={taxEstimate} />

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Stat icon={Wallet} label="Total Income (YTD)" value={`$${totalIncome.toLocaleString()}`} delta={`${incomes.length} sources`} trend="up" />
        <Stat icon={TrendingUp} label="Estimated Tax" value={`$${taxEstimate.toLocaleString()}`} delta={`${taxRate}% rate`} trend="neutral" />
        <Stat icon={AlertTriangle} label="Active Alerts" value={`${alerts.length}`} delta={`${alerts.filter(a => !a.is_read).length} unread`} trend="down" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Income sources</h2>
            <button onClick={() => setShowIncomeForm(true)} className="text-xs font-medium text-primary hover:underline">+ Add</button>
          </div>
          {incomes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No income recorded yet. Click "Add Income" to start.</p>
          ) : (
            <div className="divide-y divide-border">
              {incomes.slice(0, 8).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/15 text-success">
                      <ArrowDownRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.platform_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.country_of_source ?? "—"} · {t.income_date}{t.category ? ` · ${t.category}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">+{Number(t.amount).toLocaleString()} {t.currency}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-semibold">Alerts</h2>
          </div>
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No alerts.</p>
          ) : (
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li key={a.id} className="rounded-xl border border-border bg-background p-3.5">
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-1 inline-block h-2 w-2 shrink-0 rounded-full ${a.is_read ? "bg-muted" : "bg-destructive"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-snug">{a.message}</p>
                      {a.due_date && <p className="mt-0.5 text-xs text-muted-foreground">Due {a.due_date}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
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
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
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

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold">Documents</h2>
          <p className="mt-1 text-xs text-muted-foreground">Invoices, receipts, tax forms.</p>

          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 py-6 text-center text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
          >
            {uploading > 0 ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileUp className="h-5 w-5" />}
            {uploading > 0 ? `Uploading ${uploading}…` : "Click to upload"}
            <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </button>

          <ul className="mt-4 space-y-2">
            {docs.map((d) => (
              <li key={d.id} className="rounded-lg border border-border bg-background p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-primary" />
                  <div className="flex-1 truncate">
                    <p className="truncate font-medium">{d.file_name}</p>
                    <p className="text-muted-foreground">{d.parse_status}</p>
                  </div>
                  <button
                    onClick={() => parseDoc(d)}
                    disabled={d.parsing}
                    title="Parse with AI"
                    className="flex items-center gap-1 rounded-md border border-violet-400/30 bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-60"
                  >
                    {d.parsing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    AI
                  </button>
                  <button onClick={() => removeDoc(d)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {(d.insight || d.parsing || d.parsed_data?.insight) && (
                  <div className="mt-2 rounded-md border border-violet-400/20 bg-violet-500/5 p-2 text-[11px] leading-relaxed text-white/80">
                    <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-violet-300">
                      <Sparkles className="h-3 w-3" /> AI insight
                    </div>
                    {d.insight || d.parsed_data?.insight || "Analyzing…"}
                    {d.parsing && <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-violet-300 align-middle" />}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {showIncomeForm && (
        <IncomeFormModal
          userId={userId}
          defaultCountry={user.country}
          onClose={() => setShowIncomeForm(false)}
          onSaved={() => { setShowIncomeForm(false); refresh(); }}
        />
      )}
    </main>
  );
}

function IncomeFormModal({
  userId, defaultCountry, onClose, onSaved,
}: { userId: string; defaultCountry: string; onClose: () => void; onSaved: () => void }) {
  const [platform, setPlatform] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState(defaultCountry);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState("Freelance");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("income_sources").insert({
      user_id: userId,
      platform_name: platform,
      amount: Number(amount),
      currency,
      country_of_source: country,
      income_date: date,
      category,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Income added");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Add income</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <FieldInput label="Platform / Client" value={platform} onChange={setPlatform} required placeholder="Acme Studios" />
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Amount" type="number" step="0.01" value={amount} onChange={setAmount} required placeholder="2400" />
          <FieldSelect label="Currency" value={currency} onChange={setCurrency} options={["USD","EUR","GBP","SGD","IDR","JPY","CAD","AUD"]} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FieldInput label="Country" value={country} onChange={setCountry} required />
          <FieldInput label="Date" type="date" value={date} onChange={setDate} required />
        </div>
        <FieldSelect label="Category" value={category} onChange={setCategory} options={["Freelance","Consulting","Royalties","Product","Other"]} />
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01] disabled:opacity-60">
          {busy ? "Saving…" : "Save income"}
        </button>
      </form>
    </div>
  );
}

function FieldInput({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
function FieldSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((o) => <option key={o} className="bg-card">{o}</option>)}
      </select>
    </label>
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
