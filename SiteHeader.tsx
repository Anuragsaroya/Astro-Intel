import { Link } from "@tanstack/react-router";
import { Orbit } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/mission", label: "Mission console" },
  { to: "/data", label: "Data sources" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-gradient-mars text-primary-foreground">
            <Orbit className="size-4" />
          </span>
          <span className="font-display text-base font-semibold leading-none">
            Mars Explorer <span className="text-primary">AI</span>
            <span className="hud-label mt-0.5 block">Team Astro Intel</span>
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Mars Explorer AI — Team Astro Intel · NASA Space Apps Challenge prototype.</p>
        <p>Terrain is modelled after NASA dataset types. Risk scores are planning aids, not safety certification.</p>
      </div>
    </footer>
  );
}
