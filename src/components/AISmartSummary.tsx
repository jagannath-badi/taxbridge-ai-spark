import { useEffect, useRef, useState } from "react";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { streamChat } from "@/lib/streamChat";

type Props = { country: string; totalIncome: number; taxEstimate: number };

export function AISmartSummary({ country, totalIncome, taxEstimate }: Props) {
  const [text, setText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const startedRef = useRef(false);

  async function run() {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setText("");
    setError(null);
    setStreaming(true);
    try {
      await streamChat({
        messages: [
          {
            role: "user",
            content: `Give me a friendly 3-sentence plain-English summary of my finances. I'm a freelancer in ${country}. YTD income: $${totalIncome.toLocaleString()} across 3 countries (USA, UK, Japan). Estimated tax owed: $${taxEstimate.toLocaleString()}. Mention which jurisdictions likely need action and any time-sensitive deadlines. Keep it under 70 words.`,
          },
        ],
        signal: ctrl.signal,
        onToken: (t) => setText((prev) => prev + t),
      });
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message ?? "AI error");
    } finally {
      setStreaming(false);
    }
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.05] p-6 shadow-[0_0_40px_-10px_rgba(124,58,237,0.4)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_22px_rgba(168,85,247,0.55)]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-white">AI Income Analyzer</h2>
              <p className="text-xs text-white/60">Live summary generated from your latest activity</p>
            </div>
            <button
              onClick={run}
              disabled={streaming}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 disabled:opacity-50"
            >
              {streaming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Regenerate
            </button>
          </div>
          <p className="mt-3 min-h-[3.5rem] whitespace-pre-wrap text-[15px] leading-relaxed text-white/90">
            {text}
            {streaming && <span className="ml-0.5 inline-block h-4 w-1.5 -mb-0.5 animate-caret bg-violet-300" />}
            {error && <span className="text-red-300">{error}</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
