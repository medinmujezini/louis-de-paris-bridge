import { Unit } from "@/types/units";
import { GlassPanel } from "@/components/ui/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { X, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

interface CompareFloatingBarProps {
  units: Unit[];
  maxUnits?: number;
  onRemove: (unitId: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export function CompareFloatingBar({
  units,
  maxUnits = 3,
  onRemove,
  onCompare,
  onClear,
}: CompareFloatingBarProps) {
  const { t } = useLanguage();

  if (units.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <GlassPanel variant="sidebar" className="px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Counter */}
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {t.units.compare.title} ({units.length}/{maxUnits})
            </span>
          </div>

          {/* Unit chips */}
          <div className="flex items-center gap-2">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30"
              >
                <span className="text-xs font-medium text-primary-foreground">
                  {unit.name}
                </span>
                <button
                  onClick={() => onRemove(unit.id)}
                  className="p-0.5 rounded-full hover:bg-primary/30 transition-colors"
                >
                  <X className="w-3 h-3 text-primary-foreground" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground"
            >
              {t.units.compare.clearAll}
            </GlassButton>
            <GlassButton
              size="sm"
              onClick={onCompare}
              disabled={units.length < 2}
              className={cn(
                units.length >= 2 && "bg-primary text-primary-foreground"
              )}
            >
              {t.units.compare.compareNow}
            </GlassButton>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
