import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, LogOut } from "lucide-react";
import { useSession } from "../lib/session";

export function Navbar() {
  const { user, logout } = useSession();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070418]/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            TaxBridge
            <span className="bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
              AI
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-white/70 transition hover:text-white">
            Home
          </Link>
          <a href="/#features" className="text-sm text-white/70 transition hover:text-white">
            Features
          </a>
          <a href="/#pricing" className="text-sm text-white/70 transition hover:text-white">
            Pricing
          </a>
          {user && (
            <Link to="/dashboard" className="text-sm text-white/70 transition hover:text-white">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="relative inline-flex items-center rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.45)] transition hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
