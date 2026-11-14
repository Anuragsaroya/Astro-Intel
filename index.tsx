import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertsBar } from "@/components/mars/AlertsBar";
import { AppHeader } from "@/components/mars/AppHeader";
import { AssistantPanel } from "@/components/mars/AssistantPanel";
import { ConditionsPanel } from "@/components/mars/ConditionsPanel";
import { LayerPanel } from "@/components/mars/LayerPanel";
import { MapView } from "@/components/mars/MapView";
import { RoutePanel } from "@/components/mars/RoutePanel";
import { SiteBrief } from "@/components/mars/SiteBrief";
import { EvaControls, SuitPanel } from "@/components/mars/SuitPanel";
import { WaypointDetail } from "@/components/mars/WaypointDetail";
import { useMissionModel } from "@/lib/mars/useMissionModel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Control · Marswalk Nav" },
      {
        name: "description",
        content: "Plan a safe Marswalk: layered NASA imagery, route planner, radiation, weather, water ice and suit consumables.",
      },
      { property: "og:title", content: "Mission Control · Marswalk Nav" },
      {
        property: "og:description",
        content: "Plan a safe Marswalk with NASA imagery, hazards, radiation, weather, water ice and suit status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MissionControl,
});

const tabCls = "text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground";

function MissionControl() {
  const model = useMissionModel();
  const { selected, site } = model;
  return (
    <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden">
      <AppHeader model={model} />
      <main className="grid flex-1 gap-2 p-2 lg:min-h-0 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
        {/* Map */}
        <section className="relative h-[60vh] min-h-[380px] overflow-hidden rounded-lg border border-border lg:order-2 lg:h-auto">
          <MapView model={model} />
          <div className="pointer-events-none absolute left-2 top-2 z-[500] max-w-[min(360px,70%)] space-y-1.5">
            <div className="pointer-events-auto rounded-md border border-border bg-card/90 px-3 py-2 backdrop-blur">
              <div className="font-display text-sm font-bold uppercase tracking-[0.14em]">{site.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground">{site.imagery.label}</div>
            </div>
            <AlertsBar model={model} className="pointer-events-auto" />
          </div>
          {selected && (
            <div className="absolute bottom-14 left-2 z-[500] w-[min(320px,calc(100%-1rem))]">
              <WaypointDetail model={model} w={selected} />
            </div>
          )}
          <div className="absolute inset-x-2 bottom-2 z-[500] rounded-md border border-border bg-card/90 p-2 backdrop-blur sm:right-auto">
            <EvaControls model={model} compact />
          </div>
        </section>

        {/* Left: planning */}
        <aside className="panel min-h-0 overflow-hidden lg:order-1">
          <Tabs defaultValue="route" className="flex h-full flex-col">
            <TabsList className="m-2 grid grid-cols-3">
              <TabsTrigger value="route" className={tabCls}>Route</TabsTrigger>
              <TabsTrigger value="layers" className={tabCls}>Layers</TabsTrigger>
              <TabsTrigger value="site" className={tabCls}>Site</TabsTrigger>
            </TabsList>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
              <TabsContent value="route" className="mt-0"><RoutePanel model={model} /></TabsContent>
              <TabsContent value="layers" className="mt-0"><LayerPanel model={model} /></TabsContent>
              <TabsContent value="site" className="mt-0"><SiteBrief model={model} /></TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Right: live */}
        <aside className="panel min-h-[520px] overflow-hidden lg:order-3 lg:min-h-0">
          <Tabs defaultValue="conditions" className="flex h-full flex-col">
            <TabsList className="m-2 grid grid-cols-3">
              <TabsTrigger value="conditions" className={tabCls}>Conditions</TabsTrigger>
              <TabsTrigger value="suit" className={tabCls}>Suit & EVA</TabsTrigger>
              <TabsTrigger value="capcom" className={tabCls}>CAPCOM-AI</TabsTrigger>
            </TabsList>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
              <TabsContent value="conditions" className="mt-0"><ConditionsPanel model={model} /></TabsContent>
              <TabsContent value="suit" className="mt-0"><SuitPanel model={model} /></TabsContent>
              <TabsContent value="capcom" className="mt-0 h-[min(560px,calc(100vh-150px))]">
                <AssistantPanel model={model} className="h-full" />
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </main>
    </div>
  );
}
