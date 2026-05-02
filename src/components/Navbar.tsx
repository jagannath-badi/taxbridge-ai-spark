import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Sparkles, LogOut } from "lucide-react";
import { useTheme } from "../lib/theme";
import { useSession } from "../lib/session";

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useSession();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            TaxBridge<span className="text-gradient">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-foreground">
            Home
          </Link>
          <a href="/#features" className="text-sm text-muted-foreground transition hover:text-foreground">
            Features
          </a>
          <a href="/#pricing" className="text-sm text-muted-foreground transition hover:text-foreground">
            Pricing
          </a>
          {user && (
            <Link to="/dashboard" className="text-sm text-muted-foreground transition hover:text-foreground">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-secondary"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-glow"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
