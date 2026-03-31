import { Unit } from "@/types/units";
import { Bed, Bath, Maximize, Save, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";

interface UnitCardProps {
  unit: Unit;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isInCompare?: boolean;
  compareDisabled?: boolean;
  onSelect?: (unit: Unit) => void;
  onHover?: (unitId: string | null) => void;
  onToggleCompare?: (unit: Unit) => void;
}

export function UnitCard({
  unit,
  isSelected,
  isHighlighted,
  isInCompare,
  compareDisabled,
  onSelect,
  onHover,
  onToggleCompare,
}: UnitCardProps) {
  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare?.(unit);
  };

  const handleExploreInterior = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendToUnreal(UEEvents.ENTER_INTERIOR_EDIT, { unitId: unit.id });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-150",
        "border-b border-white/[0.08]",
        "hover:bg-white/[0.04]",
        isSelected && "bg-white/[0.06]",
        isHighlighted && "bg-white/[0.04]",
        isInCompare && "bg-primary/[0.04]"
      )}
      style={{
        borderImage: "linear-gradient(90deg, transparent 5%, hsl(0 0% 100% / 0.15) 30%, hsl(0 0% 100% / 0.25) 50%, hsl(0 0% 100% / 0.15) 70%, transparent 95%) 1",
      }}
      onClick={() => onSelect?.(unit)}
      onMouseEnter={() => onHover?.(unit.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="px-4 py-3">
        {/* Row 1: Name + Price */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground truncate">
            {unit.name}
          </span>
          {onToggleCompare && (
            <button
              onClick={handleCompareToggle}
              disabled={compareDisabled && !isInCompare}
              className={cn(
                "shrink-0 transition-opacity",
                isInCompare ? "text-primary opacity-100" : "text-muted-foreground opacity-50 hover:opacity-100",
                compareDisabled && !isInCompare && "cursor-not-allowed"
              )}
            >
              <Save className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Row 2: Compact meta */}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span>F{unit.floor}</span>
          {unit.building && (
            <span className="text-primary/70 font-medium">B{unit.building}</span>
          )}
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {unit.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {unit.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-3 h-3" />
            {unit.surface}m²
          </span>
          {!unit.available && (
            <span className="text-destructive/70 font-medium ml-auto">Sold</span>
          )}
        </div>

        {/* Demo unit: Explore Interior CTA */}
        {unit.isDemo && unit.available && (
          <button
            onClick={handleExploreInterior}
            className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Explore Interior
          </button>
        )}
      </div>
    </div>
  );
}
