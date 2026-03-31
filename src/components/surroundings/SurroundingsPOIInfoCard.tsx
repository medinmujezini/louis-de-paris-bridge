import { X, MapPin } from "lucide-react";
import { POITravelInfo } from "@/hooks/usePOITravelInfo";
import { poiCategories } from "@/types/poi";
import { cn } from "@/lib/utils";

interface SurroundingsPOIInfoCardProps {
  info: POITravelInfo;
  loading: boolean;
  onClose: () => void;
}

export function SurroundingsPOIInfoCard({ info, loading, onClose }: SurroundingsPOIInfoCardProps) {
  const cat = poiCategories.find((c) => c.id === info.category);
  const color = cat?.color || "#fff";

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
      <div
        className="relative rounded-2xl overflow-hidden bg-[hsl(220,20%,8%,0.75)] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] min-w-[320px] max-w-[420px]"
      >
        {/* Top accent bar */}
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }} />

        <div className="px-4 pt-3 pb-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">{info.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                >
                  {cat?.label || info.category}
                </span>
                {info.straightDistance && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {info.straightDistance}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.08] mb-3" />

          {/* Travel modes */}
          {loading && info.modes.length === 0 ? (
            <div className="text-[11px] text-muted-foreground text-center py-2">Loading travel times…</div>
          ) : info.modes.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {info.modes.map((mode) => (
                <div
                  key={mode.profile}
                  className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <span className="text-base">{mode.icon}</span>
                  <span className="text-xs font-semibold text-foreground">{mode.duration}</span>
                  <span className="text-[9px] text-muted-foreground">{mode.distance}</span>
                  <span className="text-[9px] text-muted-foreground/60 font-medium">{mode.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground text-center py-2">Travel info unavailable</div>
          )}
        </div>
      </div>
    </div>
  );
}
