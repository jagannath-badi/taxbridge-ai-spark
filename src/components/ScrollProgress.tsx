import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setShowTop(h.scrollTop > window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 shadow-[0_0_10px_rgba(168,85,247,0.7)] transition-[width] duration-150"
          style={{ width: `${p}%` }}
        />
      </div>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#0a0a0f]/70 text-white shadow-[0_0_20px_rgba(124,58,237,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-violet-600/30 ${
          showTop ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
