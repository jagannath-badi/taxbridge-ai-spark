import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ThemeProvider } from "../lib/theme";
import { SessionProvider } from "../lib/session";
import { Navbar } from "../components/Navbar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TaxBridge AI — Simplifying global payments & taxes for creators" },
      {
        name: "description",
        content:
          "TaxBridge AI helps freelancers and digital nomads automate cross-border tax compliance, track international payments, and stay ahead of deadlines.",
      },
      { property: "og:title", content: "TaxBridge AI — Simplifying global payments & taxes for creators" },
      { property: "og:description", content: "TaxBridge AI simplifies global payments and taxes for freelance creators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "TaxBridge AI — Simplifying global payments & taxes for creators" },
      { name: "description", content: "TaxBridge AI simplifies global payments and taxes for freelance creators." },
      { name: "twitter:description", content: "TaxBridge AI simplifies global payments and taxes for freelance creators." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0ea17369-5ded-493e-b5fb-1e359b62b04d/id-preview-ddaa1a71--3dff6ad4-907c-45e7-9575-df2d3cc7e558.lovable.app-1777685333712.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0ea17369-5ded-493e-b5fb-1e359b62b04d/id-preview-ddaa1a71--3dff6ad4-907c-45e7-9575-df2d3cc7e558.lovable.app-1777685333712.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <Outlet />
        </div>
      </SessionProvider>
    </ThemeProvider>
  );
}
