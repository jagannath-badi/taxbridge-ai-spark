import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Sparkles, X, Loader2 } from "lucide-react";
import { streamChat, type ChatMsg } from "@/lib/streamChat";

const SUGGESTED = [
  "Estimate my taxes for Q2",
  "Explain VAT for creators",
  "Which countries tax freelancers?",
  "Do I need to file GST in Singapore?",
];

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm TaxBridge AI — your tax assistant for cross-border income. Ask me anything about freelance taxes in SEA, GST, withholding, or filing deadlines.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function ask(text: string) {
    const q = text.trim();
    if (!q || streaming) return;
    setError(null);
    setInput("");
    const next: ChatMsg[] = [...messages, { role: "user", content: q }, { role: "assistant", content: "" }];
    setMessages(next);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      await streamChat({
        messages: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        signal: ctrl.signal,
        onToken: (tok) => {
          setMessages((prev) => {
            const copy = prev.slice();
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { ...last, content: last.content + tok };
            return copy;
          });
        },
      });
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        setError(e?.message ?? "Something went wrong");
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.7)] transition-transform hover:scale-110"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0a0a0f]" />
        </span>
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-24 right-5 z-[60] w-[min(420px,calc(100vw-2.5rem))] origin-bottom-right transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/95 shadow-[0_20px_60px_-15px_rgba(124,58,237,0.5)] backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_18px_rgba(168,85,247,0.6)]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">TaxBridge AI</div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Powered by AI · Gemini 3 Flash
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="max-h-[55vh] min-h-[280px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#7c3aed] text-white shadow-[0_0_18px_rgba(124,58,237,0.4)]"
                      : "text-white/90"
                  }`}
                >
                  {m.content}
                  {streaming && i === messages.length - 1 && m.role === "assistant" && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 -mb-0.5 animate-caret bg-violet-300" />
                  )}
                  {!m.content && !streaming && m.role === "assistant" && (
                    <span className="text-white/40">…</span>
                  )}
                </div>
              </div>
            ))}
            {error && (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && !streaming && (
            <div className="flex flex-wrap gap-2 border-t border-white/5 px-4 pt-3">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/75 transition hover:border-violet-400/50 hover:bg-white/[0.08] hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about taxes, GST, withholding…"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-violet-400/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_0_18px_rgba(139,92,246,0.5)] transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
