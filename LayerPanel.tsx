import { Layers } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { HAZARD_RGB, LAYER_INFO, LAYER_ORDER, MINERAL_RGB, RAMPS, rampCss, type LayerId } from "@/lib/mars/render";
import { MINERAL_LABEL, Mineral } from "@/lib/mars/terrain";
import { cn } from "@/lib/utils";

export interface LayerState {
  on: boolean;
  opacity: number;
}

const rgb = (c: [number, number, number]) => `rgb(${c.join(",")})`;

function Legend({ id }: { id: LayerId }) {
  if (id === "ice")
    return (
      <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
        {[
          ["rgb(235,252,255)", "Bare ice (surface)"],
          ["rgb(120,220,245)", "Ice < 1 m deep"],
          ["rgb(60,140,230)", "Ice 1–3 m deep"],
          ["rgb(40,70,180)", "Ice > 3 m deep"],
          ["rgb(90,210,200)", "Water in minerals"],
        ].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: c }} />
            {l}
          </span>
        ))}
      </div>
    );
  if (id === "hazard")
    return (
      <div className="flex gap-3 text-[10px] text-muted-foreground">
        {["Safe", "Caution", "Danger"].map((l, i) => (
          <span key={l} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: rgb(HAZARD_RGB[i]!) }} />
            {l}
          </span>
        ))}
      </div>
    );
  if (id === "spectral")
    return (
      <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
        {[Mineral.Clay, Mineral.Carbonate, Mineral.Olivine, Mineral.Sulfate, Mineral.WaterIce, Mineral.Basalt].map((m) => (
          <span key={m} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: rgb(MINERAL_RGB[m]) }} />
            {MINERAL_LABEL[m]}
          </span>
        ))}
      </div>
    );
  const ramp = id === "topo" ? RAMPS.topo : id === "thermal" ? RAMPS.thermal : id === "radiation" ? RAMPS.radiation : id === "science" ? RAMPS.science : null;
  if (!ramp) return null;
  const [lo, hi] = id === "topo" ? ["Low", "High"] : id === "thermal" ? ["Cold", "Warm"] : id === "radiation" ? ["Lower dose", "Higher"] : ["Low", "High value"];
  return (
    <div>
      <div className="h-1.5 rounded-full" style={{ background: rampCss(ramp) }} />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{lo}</span>
        <span>{hi}</span>
      </div>
    </div>
  );
}

export function LayerPanel({ state, onChange }: { state: Record<LayerId, LayerState>; onChange: (id: LayerId, s: LayerState) => void }) {
  return (
    <section className="hud-panel p-3">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Layers className="size-4 text-primary" /> Data layers
      </h2>
      <ul className="space-y-2">
        {LAYER_ORDER.map((id) => {
          const info = LAYER_INFO[id];
          const s = state[id];
          const ice = id === "ice";
          return (
            <li key={id} className={cn("rounded-md border p-2 transition-colors", s.on ? (ice ? "border-ice/60 bg-ice/5" : "border-border bg-secondary/40") : "border-transparent")}>
              <label className="flex cursor-pointer items-center gap-2">
                <Switch checked={s.on} onCheckedChange={(on) => onChange(id, { ...s, on })} aria-label={info.label} />
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-xs font-medium", ice && "text-ice")}>{info.label}</span>
                  <span className="block truncate font-mono text-[10px] text-muted-foreground">{info.source}</span>
                </span>
              </label>
              {s.on && (
                <div className="mt-2 space-y-2 pl-11">
                  <Slider value={[s.opacity]} min={0.1} max={1} step={0.05} onValueChange={(v) => onChange(id, { ...s, opacity: v[0] ?? s.opacity })} aria-label={`${info.label} opacity`} />
                  <Legend id={id} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
