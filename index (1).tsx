import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Beaker, Droplets, Flame, Gauge, Layers, Map, Route as RouteIcon, ShieldAlert, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/mars-hero.jpg";
import iceImg from "@/assets/mars-ice.jpg";
import { SITE_ORDER, SITES, type SiteId } from "@/lib/mars/sites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mars Explorer AI — Safe Marswalks & Water Ice Finder" },
      { name: "description", content: "Team Astro Intel's Mars mission planner: layered NASA-style maps, hazard zones, safe route planning and a frozen water-ice finder for astronauts." },
      { property: "og:title", content: "Mars Explorer AI — Safe Marswalks & Water Ice Finder" },
      { property: "og:description", content: "Plan safer, science-rich Mars surface missions and find frozen water ice — by Team Astro Intel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ICE_BADGE: Record<SiteId, string> = {
  jezero: "Water bound in clays",
  arcadia: "Ice 0.3–2 m below surface",
  korolev: "1.8 km thick frozen ice lake",
};

const MODULES = [
  { icon: Map, title: "Interactive Mars map", text: "Zoom and pan a 10 × 7 km site, with habitats, science targets and ice deposits marked." },
  { icon: Layers, title: "8 data layers", text: "Elevation, contours, temperature, minerals, radiation, science value, hazards and ice — stack and fade them." },
  { icon: Snowflake, title: "Water-ice finder", text: "See bare ice, ice under the dust and water locked in rock, with litres of water per cubic metre." },
  { icon: ShieldAlert, title: "Hazard zones", text: "Slopes, boulder fields, soft sand and slippery ice graded safe, caution or danger." },
  { icon: RouteIcon, title: "Route planner", text: "Four routes side by side — shortest, safest, science and ice/water — with distance, time and risk." },
  { icon: Gauge, title: "Marswalk simulator", text: "Walk the route: live O₂, battery, radiation, hazard alerts and an emergency return-to-base warning." },
];

function Index() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img src={heroImg} alt="Astronaut standing on rust-red Martian terrain beside exposed water ice" className="absolute inset-0 -z-10 h-full w-full object-cover" width={1920} height={1088} />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto flex min-h-[78vh] max-w-[1600px] flex-col justify-end px-4 pb-16 pt-32">
          <p className="hud-label text-foreground/80">NASA Space Apps · Interplanetary Survival Guide</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">
            Walk Mars safely. <span className="text-ice">Find the water.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-foreground/85 md:text-lg">
            Mars Explorer AI turns orbital and rover data into a mission plan: where it is safe to walk, what is worth sampling, and where frozen ice can keep a crew alive.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-glow">
              <Link to="/mission">
                Open mission console <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-ice/60 bg-background/40 text-ice hover:bg-ice/10 hover:text-ice">
              <Link to="/mission" search={{ site: "korolev" }}>
                <Snowflake /> Explore the ice lake
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <dl className="mx-auto grid max-w-[1600px] grid-cols-2 gap-px px-4 md:grid-cols-4">
          {[
            ["3", "landing sites"],
            ["8", "map data layers"],
            ["4", "route strategies"],
            ["< 1 m", "to ice at Arcadia"],
          ].map(([v, l]) => (
            <div key={l} className="py-6">
              <dt className="font-display text-3xl font-semibold text-primary">{v}</dt>
              <dd className="text-sm text-muted-foreground">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto grid max-w-[1600px] items-center gap-10 px-4 py-20 lg:grid-cols-2">
        <div>
          <p className="hud-label text-ice">Frozen water ice</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Ice is the resource that makes Mars survivable</h2>
          <p className="mt-4 text-muted-foreground">
            Every cubic metre of pure ice melts into about 917 litres of water. Split it and you get oxygen to breathe and hydrogen for rocket fuel. Our ice layer shows exactly where it is — on the surface, a hand-drill away, or locked in rock.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Droplets, t: "Drinking water", d: "Melt and filter ice cores" },
              { icon: Beaker, t: "Oxygen", d: "Electrolysis: 2H₂O → 2H₂ + O₂" },
              { icon: Flame, t: "Rocket fuel", d: "H₂ + CO₂ → methane for the ride home" },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="rounded-md border border-ice/30 bg-ice/5 p-3">
                <Icon className="size-5 text-ice" />
                <p className="mt-2 text-sm font-semibold">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <img src={iceImg} alt="Astronaut drilling a frozen ice core from a Martian ice deposit" className="aspect-[4/3] w-full rounded-lg border border-ice/30 object-cover shadow-ice" loading="lazy" width={1280} height={960} />
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pb-20">
        <h2 className="text-3xl font-semibold">Three sites, three kinds of water</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SITE_ORDER.map((id) => {
            const s = SITES[id];
            return (
              <Link key={id} to="/mission" search={{ site: id }} className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary">
                <p className="hud-label">
                  {s.lat.toFixed(1)}° N · {s.lon.toFixed(1)}° E
                </p>
                <h3 className="mt-1 text-lg font-semibold">{s.name}</h3>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ice/15 px-2.5 py-1 text-xs text-ice">
                  <Snowflake className="size-3" /> {ICE_BADGE[id]}
                </span>
                <p className="mt-3 text-sm text-muted-foreground">{s.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                  Plan a Marswalk <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-grid">
        <div className="mx-auto max-w-[1600px] px-4 py-20">
          <h2 className="text-3xl font-semibold">What the mission console does</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="hud-panel p-5">
                <Icon className="size-5 text-primary" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link to="/mission">
                Start planning <ArrowRight />
              </Link>
            </Button>
            <Link to="/data" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              See the NASA datasets behind each layer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
