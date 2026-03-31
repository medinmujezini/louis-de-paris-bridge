import { POI } from "@/types/poi";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Navigation, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";

interface POICardProps {
  poi: POI;
  isSelected?: boolean;
  onSelect?: (poi: POI) => void;
  compact?: boolean;
}

export function POICard({ poi, isSelected, onSelect, compact }: POICardProps) {
  const handleFocus = () => {
    sendToUnreal(UEEvents.FOCUS_POI, { 
      id: poi.id, 
      category: poi.category,
      animate: true 
    });
  };

  const handleSelect = () => {
    onSelect?.(poi);
    handleFocus();
  };

  if (compact) {
    return (
      <button
        onClick={handleSelect}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
          "bg-white/5 hover:bg-white/10 border border-transparent",
          isSelected && "border-primary bg-primary/10"
        )}
      >
        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-medium text-foreground truncate">{poi.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {poi.distance}
          </p>
        </div>
        {poi.rating && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{poi.rating}</span>
          </div>
        )}
      </button>
    );
  }

  return (
    <GlassCard
      variant={isSelected ? "strong" : "default"}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={handleSelect}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{poi.name}</h3>
              {poi.address && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {poi.address}
                </p>
              )}
            </div>
          </div>
          {poi.rating && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{poi.rating}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {poi.description}
        </p>

        {/* Tags */}
        {poi.tags && poi.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {poi.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-white/5 border-white/10"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{poi.distance}</span>
          </div>
          <div className="flex gap-2">
            <GlassButton
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleFocus();
              }}
            >
              <Navigation className="w-4 h-4 mr-1" />
              Focus
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
