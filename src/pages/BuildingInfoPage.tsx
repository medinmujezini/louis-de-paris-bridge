import { useLanguage } from "@/i18n/LanguageContext";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { GlassCard } from "@/components/ui/glass-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Ruler,
  Layers,
  DoorOpen,
  GalleryHorizontalEnd,
  Wifi,
  Bath,
  Hammer,
  ThermometerSun,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface InfoRow {
  label: string;
  value: string;
}

const InfoGrid = ({ items }: { items: InfoRow[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
    {items.map((item, i) => (
      <div key={i} className="flex flex-col gap-0.5">
        <span className="text-muted-foreground text-xs">{item.label}</span>
        <span className="text-foreground text-sm font-medium">{item.value}</span>
      </div>
    ))}
  </div>
);

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) => (
  <AccordionItem value={title} className="border-b-0">
    <RoyalDivider variant="line" />
    <AccordionTrigger className="hover:no-underline py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-base font-semibold text-foreground text-left">{title}</span>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      <div className="pl-12 pb-2">{children}</div>
    </AccordionContent>
  </AccordionItem>
);

const BuildingInfoPage = () => {
  const { t } = useLanguage();
  const b = t.buildingInfo;

  return (
    <div className="relative w-full h-[calc(100vh-6rem)]">
      {/* Dark overlay backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[5]" />
      <div className="absolute right-3 top-0 bottom-3 w-[630px] max-w-[90vw] z-10">
        <div className="h-full flex flex-col overflow-hidden rounded-xl bg-[hsl(0,0%,4%)] border border-primary/20">
          {/* Header */}
          <div className="p-5 pb-3">
            <div className="flex items-center gap-3 mb-1">
              <Building2 className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">{b.title}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{b.subtitle}</p>
          </div>
          <RoyalDivider variant="ornament" />

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-5 pt-2">
              {/* Key stats strip */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: b.stats.floors, value: "11" },
                  { label: b.stats.units, value: "~500" },
                  { label: b.stats.height, value: "38 m" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-muted/50 p-3 text-center"
                  >
                    <p className="text-lg font-bold text-foreground">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <Accordion
                type="multiple"
                defaultValue={[b.sections.location, b.sections.structure]}
                className="space-y-0"
              >
                {/* Location */}
                <SectionCard icon={MapPin} title={b.sections.location}>
                  <InfoGrid
                    items={[
                      { label: b.location.address, value: "Rr. Dino, Prishtinë" },
                      { label: b.location.city, value: "Prishtinë, Kosovë" },
                      { label: b.location.coordinates, value: "42.6629° N, 21.1655° E" },
                      { label: b.location.zone, value: b.location.zoneValue },
                    ]}
                  />
                </SectionCard>

                {/* Structure */}
                <SectionCard icon={Layers} title={b.sections.structure}>
                  <InfoGrid
                    items={[
                      { label: b.structure.buildings, value: "2" },
                      { label: b.structure.floors, value: "11 (+ 2 underground)" },
                      { label: b.structure.height, value: "38 m" },
                      { label: b.structure.totalArea, value: "~45,000 m²" },
                      { label: b.structure.foundation, value: b.structure.foundationValue },
                      { label: b.structure.frameType, value: b.structure.frameTypeValue },
                    ]}
                  />
                </SectionCard>

                {/* Building Materials */}
                <SectionCard icon={Hammer} title={b.sections.materials}>
                  <InfoGrid
                    items={[
                      { label: b.materials.exterior, value: b.materials.exteriorValue },
                      { label: b.materials.insulation, value: b.materials.insulationValue },
                      { label: b.materials.interiorWalls, value: b.materials.interiorWallsValue },
                      { label: b.materials.flooring, value: b.materials.flooringValue },
                      { label: b.materials.roofing, value: b.materials.roofingValue },
                    ]}
                  />
                </SectionCard>

                {/* Doors */}
                <SectionCard icon={DoorOpen} title={b.sections.doors}>
                  <InfoGrid
                    items={[
                      { label: b.doors.entrance, value: b.doors.entranceValue },
                      { label: b.doors.interior, value: b.doors.interiorValue },
                      { label: b.doors.security, value: b.doors.securityValue },
                      { label: b.doors.fireRated, value: b.doors.fireRatedValue },
                    ]}
                  />
                </SectionCard>

                {/* Windows */}
                <SectionCard icon={GalleryHorizontalEnd} title={b.sections.windows}>
                  <InfoGrid
                    items={[
                      { label: b.windows.type, value: b.windows.typeValue },
                      { label: b.windows.glazing, value: b.windows.glazingValue },
                      { label: b.windows.frame, value: b.windows.frameValue },
                      { label: b.windows.uValue, value: "1.1 W/m²K" },
                    ]}
                  />
                </SectionCard>

                {/* Smart Home */}
                <SectionCard icon={Wifi} title={b.sections.smartHome}>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(b.smartHome.features as unknown as string[]).map((f: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {f}
                        </Badge>
                      ))}
                    </div>
                    <InfoGrid
                      items={[
                        { label: b.smartHome.system, value: b.smartHome.systemValue },
                        { label: b.smartHome.connectivity, value: "Wi-Fi 6, Zigbee, Z-Wave" },
                      ]}
                    />
                  </div>
                </SectionCard>

                {/* Bathrooms */}
                <SectionCard icon={Bath} title={b.sections.bathrooms}>
                  <InfoGrid
                    items={[
                      { label: b.bathrooms.toilets, value: b.bathrooms.toiletsValue },
                      { label: b.bathrooms.showers, value: b.bathrooms.showersValue },
                      { label: b.bathrooms.tiles, value: b.bathrooms.tilesValue },
                      { label: b.bathrooms.fixtures, value: b.bathrooms.fixturesValue },
                      { label: b.bathrooms.heated, value: b.bathrooms.heatedValue },
                    ]}
                  />
                </SectionCard>

                {/* HVAC / Energy */}
                <SectionCard icon={ThermometerSun} title={b.sections.energy}>
                  <InfoGrid
                    items={[
                      { label: b.energy.heating, value: b.energy.heatingValue },
                      { label: b.energy.cooling, value: b.energy.coolingValue },
                      { label: b.energy.ventilation, value: b.energy.ventilationValue },
                      { label: b.energy.energyClass, value: "A+" },
                    ]}
                  />
                </SectionCard>

                {/* Safety */}
                <SectionCard icon={ShieldCheck} title={b.sections.safety}>
                  <InfoGrid
                    items={[
                      { label: b.safety.fireProtection, value: b.safety.fireProtectionValue },
                      { label: b.safety.seismic, value: b.safety.seismicValue },
                      { label: b.safety.cctv, value: b.safety.cctvValue },
                      { label: b.safety.access, value: b.safety.accessValue },
                    ]}
                  />
                </SectionCard>

                {/* Electrical */}
                <SectionCard icon={Zap} title={b.sections.electrical}>
                  <InfoGrid
                    items={[
                      { label: b.electrical.evCharging, value: b.electrical.evChargingValue },
                      { label: b.electrical.backup, value: b.electrical.backupValue },
                      { label: b.electrical.solar, value: b.electrical.solarValue },
                    ]}
                  />
                </SectionCard>
              </Accordion>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default BuildingInfoPage;
