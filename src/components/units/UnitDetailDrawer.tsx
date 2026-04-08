import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { Unit } from "@/types/units";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UnitContactForm } from "./UnitContactForm";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { useThreeDMode } from "@/contexts/ThreeDModeContext";
import {
  Bed,
  Bath,
  Maximize,
  Building2,
  Eye,
  FileText,
  Image,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Ruler,
  Layers,
  Save,
  Printer,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnitPrintBrochure } from "./UnitPrintBrochure";

interface UnitDetailDrawerProps {
  unit: Unit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleCompare?: (unit: Unit) => void;
  isInCompare?: boolean;
  compareDisabled?: boolean;
}

// Mock gallery images - in production these would come from the unit data
const mockGalleryImages = [
  { id: 1, label: "Living Room", placeholder: true },
  { id: 2, label: "Kitchen", placeholder: true },
  { id: 3, label: "Master Bedroom", placeholder: true },
  { id: 4, label: "Bathroom", placeholder: true },
  { id: 5, label: "Balcony View", placeholder: true },
];

export function UnitDetailDrawer({
  unit,
  open,
  onOpenChange,
  onToggleCompare,
  isInCompare,
  compareDisabled,
}: UnitDetailDrawerProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [printUnit, setPrintUnit] = useState<Unit | null>(null);
  const [activeTab, setActiveTab] = useState("specs");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const threeDMode = useThreeDMode();

  const handlePrint = useCallback((u: Unit) => {
    setPrintUnit(u);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintUnit(null), 500);
    }, 100);
  }, []);

  if (!unit) return null;

  const handleFocusInUE = () => {
    sendToUnreal(UEEvents.ENTER_INTERIOR, { id: unit.id });
    threeDMode.enter(unit); // sets phase to "loading"
    onOpenChange(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const pricePerSqm = Math.round(unit.price / unit.surface);

  const specifications = [
    { icon: Bed, label: "Bedrooms", value: unit.bedrooms },
    { icon: Bath, label: "Bathrooms", value: unit.bathrooms },
    { icon: Maximize, label: "Surface", value: `${unit.surface} m²` },
    { icon: Building2, label: "Floor", value: unit.floor },
    { icon: DollarSign, label: "Price", value: formatPrice(unit.price) },
    { icon: Ruler, label: "Price/m²", value: formatPrice(pricePerSqm) },
  ];

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === mockGalleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? mockGalleryImages.length - 1 : prev - 1
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl bg-background/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden"
      >
        {/* Red gradient orbs */}
        <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-primary/15 blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-40 -left-16 w-48 h-48 rounded-full bg-primary/10 blur-[80px] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-[60%] right-10 w-32 h-32 rounded-full bg-primary/8 blur-[60px] pointer-events-none" aria-hidden="true" />

        <ScrollArea className="h-full relative z-10">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-2xl font-bold text-foreground">
                    {unit.name}
                  </SheetTitle>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Building2 className="w-4 h-4" />
                    Floor {unit.floor}
                  </p>
                </div>
                <Badge
                  variant={unit.available ? "default" : "secondary"}
                  className={cn(
                    "text-sm",
                    unit.available
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {unit.available ? "Available" : "Sold"}
                </Badge>
              </div>

              {/* Price Banner */}
              <GlassCard variant="strong" className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(unit.price)}
                    </p>
                  </div>
                  <GlassButton onClick={handleFocusInUE}>
                    <Eye className="w-4 h-4 mr-2" />
                    View in 3D
                  </GlassButton>
                </div>
              </GlassCard>
            </SheetHeader>

            <RoyalDivider variant="subtle" className="mx-2" />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-white/5 border border-white/10">
                <TabsTrigger value="specs" className="flex-1 gap-2">
                  <Layers className="w-4 h-4" />
                  Specs
                </TabsTrigger>
                <TabsTrigger value="floorplan" className="flex-1 gap-2">
                  <FileText className="w-4 h-4" />
                  Floor Plan
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1 gap-2">
                  <Image className="w-4 h-4" />
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex-1 gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact
                </TabsTrigger>
              </TabsList>

              {/* Specifications Tab */}
              <TabsContent value="specs" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {specifications.map((spec) => (
                    <GlassCard
                      key={spec.label}
                      variant="subtle"
                      className="p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <spec.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {spec.label}
                          </p>
                          <p className="font-semibold text-foreground">
                            {spec.value}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>

                {/* Features */}
                {unit.features && unit.features.length > 0 && (
                  <GlassCard variant="subtle" className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {unit.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="bg-white/10"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </TabsContent>

              {/* Floor Plan Tab */}
              <TabsContent value="floorplan" className="mt-4">
                <GlassCard variant="subtle" className="p-4">
                  <div className="aspect-[4/3] rounded-lg bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center">
                    <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Floor Plan Placeholder
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {unit.name} - {unit.surface}m²
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <GlassButton variant="secondary" className="flex-1">
                      Download PDF
                    </GlassButton>
                    <GlassButton variant="secondary" className="flex-1">
                      Print
                    </GlassButton>
                  </div>
                </GlassCard>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="mt-4 space-y-4">
                {/* Main Image */}
                <GlassCard variant="subtle" className="p-2 relative">
                  <div className="aspect-video rounded-lg bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center">
                    <Image className="w-16 h-16 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {mockGalleryImages[activeImageIndex].label}
                    </p>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </GlassCard>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {mockGalleryImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-16 rounded-lg bg-white/5 border-2 transition-all flex items-center justify-center",
                        index === activeImageIndex
                          ? "border-primary"
                          : "border-transparent hover:border-white/20"
                      )}
                    >
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="mt-4">
                <GlassCard variant="subtle" className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Interested in {unit.name}?
                  </h3>
                  <UnitContactForm unitId={unit.id} unitName={unit.name} />
                </GlassCard>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              {onToggleCompare && (
                <GlassButton
                  onClick={() => onToggleCompare(unit)}
                  disabled={compareDisabled && !isInCompare}
                  className={cn("w-full", isInCompare && "border-primary/50")}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isInCompare ? "Saved for Comparison" : "Save for Comparison"}
                </GlassButton>
              )}
              <button
                onClick={() => handlePrint(unit)}
                className="relative w-full h-10 rounded-xl overflow-hidden glass-card glass-card--strong flex items-center justify-center gap-2 text-sm font-medium text-foreground transition-all duration-200 hover:border-white/25"
              >
                <div className="glass-card__light-bar glass-card__light-bar--strong" aria-hidden="true" />
                <Printer className="w-4 h-4" />
                Print
              </button>

              {/* Divider */}
              <RoyalDivider variant="line" className="my-2" />

              {/* Ask for Quote */}
              <button
                onClick={() => setQuoteOpen(true)}
                className="group relative w-full h-14 rounded-xl overflow-visible flex items-center justify-center gap-2 text-lg font-bold text-foreground transition-all duration-300 border border-white/10 hover:border-white/15"
                style={{
                  background: "linear-gradient(180deg, hsl(var(--primary) / 0.25) 0%, hsl(var(--primary) / 0.05) 100%)",
                  boxShadow: "0 0 16px hsl(var(--primary) / 0.2), 0 0 4px hsl(var(--primary) / 0.1)",
                }}
              >
                {/* Hover glow intensifier */}
                <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                  boxShadow: "0 0 32px hsl(var(--primary) / 0.45), 0 0 12px hsl(var(--primary) / 0.25)",
                }} />
                {/* Top light bar */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 group-hover:w-full group-hover:h-[3px]" aria-hidden="true" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[4px] blur-[4px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 group-hover:w-3/4 group-hover:blur-[6px]" aria-hidden="true" />
                <MessageSquare className="w-5 h-5" />
                Ask for Quote
              </button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>

      {/* Quote inquiry popup */}
      {quoteOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setQuoteOpen(false)}
          />
          {/* Modal */}
          <div
            className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: "rgba(10, 10, 20, 0.92)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Light bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[4px] blur-[4px] bg-gradient-to-r from-transparent via-primary to-transparent" />

            {/* Gold orb */}
            <div className="absolute top-10 -right-10 w-40 h-40 rounded-full bg-primary/15 blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">Ask for Quote</h3>
                <p className="text-sm text-muted-foreground">{unit.name} · {unit.surface}m² · Floor {unit.floor}</p>
              </div>
              <button
                onClick={() => setQuoteOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 pb-6 pt-2">
              <UnitContactForm unitId={unit.id} unitName={unit.name} />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Print brochure portal */}
      {printUnit && createPortal(
        <div id="print-root">
          <UnitPrintBrochure unit={printUnit} />
        </div>,
        document.body
      )}
    </Sheet>
  );
}
