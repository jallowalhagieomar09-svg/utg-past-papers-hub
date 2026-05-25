import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-app-state";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/utg-logo.jpg";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/papers", label: "Browse Papers" },
  { to: "/upload", label: "Upload" },
  { to: "/request", label: "Request" },
  { to: "/tips", label: "Exam Tips" },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-border shadow-soft transition-transform group-hover:scale-105">
            <img src={logo} alt="UTG Student Union" className="h-9 w-9 object-contain" />
          </span>
          <div className="leading-tight">
            <div className="font-serif text-lg text-foreground">UTGSU Academic Resource Hub</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Hub</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={user && isAdmin ? "/admin" : "/login"}
            className="hidden items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-accent sm:inline-flex"
          >
            <Shield className="h-3.5 w-3.5" /> {user && isAdmin ? "Admin" : "Sign in"}
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background text-foreground hover:bg-accent md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex max-w-6xl flex-col px-4 py-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground"
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to={user && isAdmin ? "/admin" : "/login"}
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
            >
              <Shield className="h-3.5 w-3.5" /> {user && isAdmin ? "Admin" : "Sign in"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
