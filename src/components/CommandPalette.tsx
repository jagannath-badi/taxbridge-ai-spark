import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { Home, LayoutDashboard, Sparkles, FileText, LogIn, Loader2, ArrowRight } from "lucide-react";
import { streamChat } from "@/lib/streamChat";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [streaming, setStreaming] = useState(false);
  const navigate = useNavigate();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setAiAnswer("");
      abortRef.current?.abort();
    }
  }, [open]);

  const isQuestion = query.trim().length > 8 && /\?|how|what|do i|am i|when|where|which|tax|gst|vat/i.test(query);

  async function askAI() {
    if (!query.trim() || streaming) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setStreaming(true);
    setAiAnswer("");
    try {
      await streamChat({
        messages: [{ role: "user", content: query }],
        signal: ctrl.signal,
        onToken: (t) => setAiAnswer((prev) => prev + t),
      });
    } catch (e: any) {
      if (e?.name !== "AbortError") setAiAnswer(e?.message ?? "AI error");
    } finally {
      setStreaming(false);
    }
  }

  function go(to: "/" | "/dashboard" | "/auth") {
    setOpen(false);
    navigate({ to });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/95 shadow-[0_30px_80px_-15px_rgba(124,58,237,0.5)] backdrop-blur-2xl"
      >
        <Command label="Command Menu" shouldFilter={!isQuestion}>
          <div className="flex items-center gap-3 border-b border-white/10 px-4">
            <Sparkles className="h-4 w-4 text-violet-300" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isQuestion) {
                  e.preventDefault();
                  askAI();
                }
              }}
              placeholder="Search pages or ask the AI anything…"
              className="flex-1 bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/40"
            />
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">ESC</kbd>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            {isQuestion && (
              <div className="mb-2 rounded-xl border border-violet-400/30 bg-violet-500/[0.06] p-3">
                <button
                  onClick={askAI}
                  disabled={streaming}
                  className="flex w-full items-center justify-between gap-2 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-300" />
                    <span className="text-sm font-medium text-white">Ask AI</span>
                    <span className="truncate text-xs text-white/55">"{query}"</span>
                  </div>
                  {streaming ? (
                    <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-violet-300" />
                  )}
                </button>
                {(aiAnswer || streaming) && (
                  <div className="mt-3 whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-sm leading-relaxed text-white/85">
                    {aiAnswer}
                    {streaming && <span className="ml-0.5 inline-block h-3 w-1.5 -mb-0.5 animate-caret bg-violet-300" />}
                  </div>
                )}
              </div>
            )}

            <Command.Empty className="px-3 py-6 text-center text-sm text-white/50">
              No results. Type a question and press Enter to ask AI.
            </Command.Empty>

            <Command.Group heading="Navigate" className="text-[10px] uppercase tracking-[0.18em] text-white/40 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
              <Item icon={Home} label="Home" onSelect={() => go("/")} />
              <Item icon={LayoutDashboard} label="Dashboard" onSelect={() => go("/dashboard")} />
              <Item icon={LogIn} label="Sign in / Sign up" onSelect={() => go("/auth")} />
            </Command.Group>

            <Command.Group heading="Quick Asks" className="text-[10px] uppercase tracking-[0.18em] text-white/40 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
              {["How much tax do I owe in Q2?", "Do I need to file GST in Singapore?", "What is withholding tax?"].map((q) => (
                <Command.Item
                  key={q}
                  value={q}
                  onSelect={() => {
                    setQuery(q);
                    setTimeout(askAI, 50);
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/85 aria-selected:bg-white/[0.06]"
                >
                  <FileText className="h-4 w-4 text-white/50" />
                  {q}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function Item({ icon: Icon, label, onSelect }: { icon: any; label: string; onSelect: () => void }) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/85 aria-selected:bg-white/[0.06]"
    >
      <Icon className="h-4 w-4 text-white/50" />
      {label}
    </Command.Item>
  );
}
