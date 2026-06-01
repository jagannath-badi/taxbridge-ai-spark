import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "../lib/session";

export function Navbar() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#0a0a0f]/70 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(168,85,247,0.25)]"
          : "border-white/[0.06] bg-[#0a0a0f]/40 backdrop-blur-xl"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_20px_rgba(168,85,247,0.55)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            TaxBridge
            <span className="bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "Home", to: "/" as const, hash: false },
            { label: "Features", to: "/#features", hash: true },
            { label: "Pricing", to: "/#pricing", hash: true },
            ...(user ? [{ label: "Dashboard", to: "/dashboard" as const, hash: false }] : []),
          ].map((l) =>
            l.hash ? (
              <a key={l.label} href={l.to} className="nav-link text-sm text-white/70 transition hover:text-white">{l.label}</a>
            ) : (
              <Link key={l.label} to={l.to} className="nav-link text-sm text-white/70 transition hover:text-white">{l.label}</Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300 sm:inline-flex">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            AI Online
          </div>
          {user ? (
            <button
              onClick={() => { logout(); navigate({ to: "/" }); }}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:scale-[1.03] hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="relative inline-flex items-center rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.45)] transition-transform duration-200 hover:scale-[1.03] hover:bg-[#8b5cf6] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)]"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
