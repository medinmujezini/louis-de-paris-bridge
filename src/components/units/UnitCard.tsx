import { Unit } from "@/types/units";
import { Bed, Bath, Maximize, Save } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const navigate = useNavigate();

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare?.(unit);
  };

  const handleExploreInterior = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendToUnreal(UEEvents.ENTER_INTERIOR_EDIT, { unitId: unit.id });
    navigate('/unit/' + unit.id + '/interior');
  };

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-150",
        "border-b border-primary/10",
        "hover:bg-primary/[0.06]",
        isSelected && "bg-primary/[0.08] border-primary/20",
        isHighlighted && "bg-primary/[0.04]",
        isInCompare && "bg-primary/[0.04]"
      )}
      onClick={() => onSelect?.(unit)}
      onMouseEnter={() => onHover?.(unit.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="px-4 py-3">
        {/* Row 1: Name */}
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "text-sm font-semibold truncate",
            isSelected ? "text-primary" : "text-foreground"
          )}>
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
            <span className="text-primary/60 font-medium ml-auto">Sold</span>
          )}
        </div>

        {/* Explore Interior CTA — shown when unit is selected & available */}
        {isSelected && unit.available && (
          <button
            onClick={handleExploreInterior}
            className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/15 text-primary text-xs font-medium hover:bg-primary/25 transition-colors border border-primary/20"
          >
            <Sparkles className="w-3 h-3" />
            Explore Interior
          </button>
        )}
      </div>
    </div>
  );
}
