import { Car, TreePine, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";

export type ParkingType = "inside" | "outside" | "underground";

interface ParkingOption {
  type: ParkingType;
  label: string;
  description: string;
  icon: React.ElementType;
  isPublic: boolean;
}

const parkingOptions: ParkingOption[] = [
  {
    type: "inside",
    label: "Inside Parking",
    description: "Private garage spots available for purchase",
    icon: Car,
    isPublic: false,
  },
  {
    type: "outside",
    label: "Outside Parking",
    description: "Public parking available for all residents",
    icon: TreePine,
    isPublic: true,
  },
  {
    type: "underground",
    label: "-1 Floor Parking",
    description: "Public underground parking for all residents",
    icon: ArrowDown,
    isPublic: true,
  },
];

interface ParkingTypeSelectorProps {
  onSelect: (type: ParkingType) => void;
}

export function ParkingTypeSelector({ onSelect }: ParkingTypeSelectorProps) {
  return (
    <div className="glass-card glass-card--strong h-full rounded-xl flex flex-col overflow-hidden">
      <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />

      <div className="relative z-10 flex flex-col h-full p-4 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Parking & Storage
          </h2>
          <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
            Choose a parking type
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-3 justify-center">
          {parkingOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => {
                const typeNames: Record<ParkingType, string> = {
                  inside: "UnderGround Parking Private",
                  outside: "Outside Parking",
                  underground: "UnderGround Parking Public",
                };
                sendToUnreal(UEEvents.SELECT_PARKING_TYPE, { type: typeNames[option.type], isPublic: option.isPublic });
                sendToUnreal(UEEvents.FOCUS_UNIT, { name: typeNames[option.type] });
                onSelect(option.type);
              }}
              className={cn(
                "group relative w-full rounded-lg border transition-all duration-200 text-left p-4",
                "border-white/[0.08] hover:border-primary/30",
                "bg-white/[0.02] hover:bg-white/[0.06]",
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  option.isPublic
                    ? "bg-muted/30 text-muted-foreground"
                    : "bg-primary/10 text-primary"
                )}>
                  <option.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                      option.isPublic
                        ? "bg-muted/20 text-muted-foreground"
                        : "bg-primary/15 text-primary"
                    )}>
                      {option.isPublic ? "Public" : "For Sale"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
