import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { FileText } from "lucide-react";
import { Unit } from "@/types/units";

interface InteriorFloorPlanOverlayProps {
  unit: Unit;
}

export function InteriorFloorPlanOverlay({ unit }: InteriorFloorPlanOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <GlassCard variant="strong" className="p-0 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10">
          <span className="text-sm font-medium text-foreground">Floor Plan</span>
        </div>

        {/* Floor plan placeholder */}
        <div className="aspect-[4/3] bg-white/5 flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Floor Plan</p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            {unit.name} — {unit.surface}m²
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
