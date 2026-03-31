import { ArrowLeft, TreePine, ArrowDown, Info } from "lucide-react";
import { ParkingType } from "./ParkingTypeSelector";

interface ParkingPublicInfoProps {
  type: Extract<ParkingType, "outside" | "underground">;
  onBack: () => void;
}

const info: Record<string, { title: string; icon: React.ElementType; details: string[] }> = {
  outside: {
    title: "Outside Parking",
    icon: TreePine,
    details: [
      "Available to all residents",
      "First-come, first-served basis",
      "No additional cost",
      "Visitor parking also available",
      "Well-lit and monitored area",
    ],
  },
  underground: {
    title: "-1 Floor Parking",
    icon: ArrowDown,
    details: [
      "Available to all residents",
      "Underground covered parking",
      "No additional cost",
      "24/7 access with resident card",
      "CCTV surveillance",
    ],
  },
};

export function ParkingPublicInfo({ type, onBack }: ParkingPublicInfoProps) {
  const data = info[type];

  return (
    <div className="glass-card glass-card--strong h-full rounded-xl flex flex-col overflow-hidden">
      <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />

      <div className="relative z-10 flex flex-col h-full p-4 space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            {data.title}
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-full bg-muted/20">
            <data.icon className="w-10 h-10 text-muted-foreground" />
          </div>

          <div className="space-y-2 w-full">
            {data.details.map((detail, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
              >
                <Info className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-foreground/80">{detail}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Contact management for more information
          </p>
        </div>
      </div>
    </div>
  );
}
