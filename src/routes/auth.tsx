import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Mail, Lock, User, Globe } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "../lib/session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — TaxBridge AI" },
      { name: "description", content: "Log in or create your TaxBridge AI account." },
    ],
  }),
  component: AuthPage,
});

const countries = ["Singapore", "Indonesia", "Philippines", "Vietnam", "Thailand", "Malaysia", "India", "United States", "United Kingdom", "Other"];

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState(countries[0]);
  const [profession, setProfession] = useState("");
  const [busy, setBusy] = useState(false);
  const { userId } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) navigate({ to: "/dashboard" });
  }, [userId, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name, country, creator_type: profession },
          },
        });
        if (error) throw error;
        toast.success("Account created!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-gradient-glow opacity-60" aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to your dashboard" : "Free forever. No card needed."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-secondary p-1">
          {(["signup", "login"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg py-2 text-sm font-medium transition ${
                mode === m ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
              }`}
            >
              {m === "signup" ? "Sign up" : "Log in"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <Field icon={User} label="Full name">
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Maya Rivera" />
            </Field>
          )}
          <Field icon={Mail} label="Email">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" placeholder="you@email.com" />
          </Field>
          <Field icon={Lock} label="Password">
            <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none" placeholder="••••••••" />
          </Field>
          {mode === "signup" && (
            <>
              <Field icon={Globe} label="Country">
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-transparent outline-none">
                  {countries.map((c) => (
                    <option key={c} className="bg-card">{c}</option>
                  ))}
                </select>
              </Field>
              <Field icon={Sparkles} label="Profession (optional)">
                <input value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Designer, Developer..." />
              </Field>
            </>
          )}

          <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01] disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}
