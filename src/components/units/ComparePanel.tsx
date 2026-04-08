import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Unit } from "@/types/units";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { Separator } from "@/components/ui/separator";
import {
  Bed,
  Bath,
  Maximize,
  Compass,
  Building2,
  Eye,
  X,
  Check,
  Minus,
  Star,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { useLanguage } from "@/i18n/LanguageContext";
import { UnitPrintBrochure } from "./UnitPrintBrochure";

interface ComparePanelProps {
  units: Unit[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (unitId: string) => void;
}

export function ComparePanel({
  units,
  open,
  onOpenChange,
  onRemove,
}: ComparePanelProps) {
  const { t } = useLanguage();
  const [printUnit, setPrintUnit] = useState<Unit | null>(null);

  const handlePrint = useCallback((unit: Unit) => {
    setPrintUnit(unit);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintUnit(null), 500);
    }, 100);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPricePerSqm = (price: number, surface: number) => {
    const pricePerSqm = price / surface;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(pricePerSqm);
  };

  const handleViewIn3D = (unit: Unit) => {
    sendToUnreal(UEEvents.FOCUS_UNIT, { name: unit.name.replace(/\s*Duplex$/i, ''), building: unit.building, animate: true });
  };

  // Helper to determine best values
  const getBestValue = (
    values: number[],
    type: "highest" | "lowest"
  ): number => {
    if (type === "highest") return Math.max(...values);
    return Math.min(...values);
  };

  const isBest = (value: number, values: number[], type: "highest" | "lowest") => {
    const best = getBestValue(values, type);
    return value === best && values.filter((v) => v === best).length === 1;
  };

  // Get all unique features across units
  const allFeatures = Array.from(
    new Set(units.flatMap((u) => u.features || []))
  ).sort();

  const bedrooms = units.map((u) => u.bedrooms);
  const bathrooms = units.map((u) => u.bathrooms);
  const surfaces = units.map((u) => u.surface);
  const prices = units.map((u) => u.price);
  const pricesPerSqm = units.map((u) => u.price / u.surface);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 glass-card glass-card--strong border-white/10 rounded-xl overflow-hidden">
        <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {t.units.compare.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6 pt-4">
            {/* Unit Headers */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${units.length}, 1fr)` }}>
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="glass-card glass-card--strong relative p-4 rounded-lg overflow-hidden"
                >
                  <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />
                  <button
                    onClick={() => onRemove(unit.id)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground pr-6">
                      {unit.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {t.units.card.floor} {unit.floor}
                      </span>
                    </div>
                    <Badge
                      variant={unit.available ? "default" : "secondary"}
                      className={cn(
                        unit.available
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {unit.available
                        ? t.units.status.available
                        : t.units.status.sold}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <RoyalDivider variant="ornament" className="my-4" />

            {/* Specifications */}
            <div className="space-y-0">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                {t.units.compare.specifications}
              </h4>

              {/* Column headers with unit names */}
              <div className="grid gap-4 items-center mb-3" style={{ gridTemplateColumns: `120px repeat(${units.length}, 1fr)` }}>
                <div />
                {units.map((unit) => (
                  <div key={unit.id} className="text-center text-sm font-semibold text-foreground">
                    {unit.name}
                  </div>
                ))}
              </div>

              {/* Bedrooms */}
              <CompareRow
                icon={<Bed className="w-4 h-4" />}
                label={t.units.filters.bedrooms}
              >
                {units.map((unit, index) => (
                  <CompareCell
                    key={unit.id}
                    value={`${unit.bedrooms} ${t.units.card.bed}`}
                    isBest={isBest(unit.bedrooms, bedrooms, "highest")}
                  />
                ))}
              </CompareRow>

              <RoyalDivider variant="line" className="my-3" />

              {/* Bathrooms */}
              <CompareRow
                icon={<Bath className="w-4 h-4" />}
                label={t.units.filters.bathrooms}
              >
                {units.map((unit, index) => (
                  <CompareCell
                    key={unit.id}
                    value={`${unit.bathrooms} ${t.units.card.bath}`}
                    isBest={isBest(unit.bathrooms, bathrooms, "highest")}
                  />
                ))}
              </CompareRow>

              <RoyalDivider variant="line" className="my-3" />

              {/* Surface */}
              <CompareRow
                icon={<Maximize className="w-4 h-4" />}
                label={t.units.filters.surface}
              >
                {units.map((unit, index) => (
                  <CompareCell
                    key={unit.id}
                    value={`${unit.surface}m²`}
                    isBest={isBest(unit.surface, surfaces, "highest")}
                  />
                ))}
              </CompareRow>

              <RoyalDivider variant="line" className="my-3" />

              {/* Orientation */}
              <CompareRow
                icon={<Compass className="w-4 h-4" />}
                label={t.units.orientation.title}
              >
                {units.map((unit) => (
                  <CompareCell key={unit.id} value={unit.orientation} />
                ))}
              </CompareRow>
            </div>


            <RoyalDivider variant="ornament" className="my-4" />

            {/* Actions */}
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${units.length}, 1fr)` }}
            >
              {units.map((unit) => (
                <div key={unit.id} className="flex flex-col gap-2">
                  <GlassButton
                    onClick={() => handleViewIn3D(unit)}
                    className="w-full"
                    disabled={!unit.available}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t.units.compare.viewIn3D}
                  </GlassButton>
                  <button
                    onClick={() => handlePrint(unit)}
                    className="relative w-full h-10 rounded-xl overflow-hidden glass-card glass-card--strong flex items-center justify-center gap-2 text-sm font-medium text-foreground transition-all duration-200 hover:border-white/25"
                  >
                    <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>

      {/* Print brochure portal */}
      {printUnit && createPortal(
        <div id="print-root">
          <UnitPrintBrochure unit={printUnit} />
        </div>,
        document.body
      )}
    </Dialog>
  );
}

// Helper components
function CompareRow({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  const childCount = React.Children.count(children);
  
  return (
    <div className="grid gap-4 items-center" style={{ gridTemplateColumns: `120px repeat(${childCount}, 1fr)` }}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function CompareCell({
  value,
  isBest,
  valueClassName,
}: {
  value: string;
  isBest?: boolean;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 py-2 rounded-md text-sm",
        isBest && "text-green-400"
      )}
    >
      <span className={valueClassName}>{value}</span>
      {isBest && <Star className="w-3 h-3 fill-current" />}
    </div>
  );
}
