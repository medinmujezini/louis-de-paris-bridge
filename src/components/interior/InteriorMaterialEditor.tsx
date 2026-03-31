import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { Paintbrush, Check, TreePine, Grid3X3, Sofa, PanelTop, DoorOpen, BedDouble, UtensilsCrossed, Armchair } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VariantOption {
  variantId: string;
  label: string;
}

interface VariantCategory {
  category: string;
  icon: React.ReactNode;
  options: VariantOption[];
}

const VARIANT_DATA: VariantCategory[] = [
  {
    category: "Dritaret",
    icon: <DoorOpen className="w-4 h-4" />,
    options: [
      { variantId: "DritareWhite", label: "White" },
      { variantId: "DritareZI", label: "Black" },
    ],
  },
  {
    category: "Parketi",
    icon: <TreePine className="w-4 h-4" />,
    options: [
      { variantId: "ParketAzuara", label: "Azuara" },
      { variantId: "ParketCodos", label: "Codos" },
      { variantId: "ParketTarragona", label: "Tarragona" },
      { variantId: "ParketJuneda", label: "Juneda" },
    ],
  },
  {
    category: "Pllakat",
    icon: <Grid3X3 className="w-4 h-4" />,
    options: [
      { variantId: "Pllaka1", label: "Pllaka 1" },
      { variantId: "Pllaka2", label: "Pllaka 2" },
      { variantId: "Pllaka3", label: "Pllaka 3" },
      { variantId: "Pllaka4", label: "Pllaka 4" },
      { variantId: "Pllaka5", label: "Pllaka 5" },
      { variantId: "Pllaka6", label: "Pllaka 6" },
      { variantId: "Pllaka7", label: "Pllaka 7" },
    ],
  },
  {
    category: "Divanet",
    icon: <Sofa className="w-4 h-4" />,
    options: [
      { variantId: "SofaBrown", label: "Brown Leather" },
      { variantId: "SofaLight", label: "Light Gray" },
    ],
  },
  {
    category: "Panelet & Dollapet",
    icon: <PanelTop className="w-4 h-4" />,
    options: [
      { variantId: "ClosetPineWood", label: "Pine Wood" },
      { variantId: "ClosetOakWood", label: "Oak Wood" },
      { variantId: "ClosetWhitePanels", label: "White Panels" },
    ],
  },
  {
    category: "Baza e Sofas",
    icon: <Armchair className="w-4 h-4" />,
    options: [
      { variantId: "BazaSofaVariant", label: "Variant 1" },
      { variantId: "BazaSofaVariant1", label: "Variant 2" },
      { variantId: "BazaSofaVariant2", label: "Variant 3" },
    ],
  },
  {
    category: "Tryezat",
    icon: <UtensilsCrossed className="w-4 h-4" />,
    options: [
      { variantId: "Tryezari1", label: "Tryezari 1" },
      { variantId: "Tryezari2", label: "Tryezari 2" },
      { variantId: "Tryezari3", label: "Tryezari 3" },
      { variantId: "Tryezari4", label: "Tryezari 4" },
    ],
  },
  {
    category: "Krevatet",
    icon: <BedDouble className="w-4 h-4" />,
    options: [
      { variantId: "Dyshat1", label: "Dyshat 1" },
      { variantId: "Dyshat2", label: "Dyshat 2" },
      { variantId: "Dyshat3", label: "Dyshat 3" },
    ],
  },
];

export function InteriorMaterialEditor() {
  const [activeCategory, setActiveCategory] = useState(VARIANT_DATA[0].category);
  const [activeVariants, setActiveVariants] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    VARIANT_DATA.forEach((cat) => {
      defaults[cat.category] = cat.options[0].variantId;
    });
    return defaults;
  });

  const currentCategory = VARIANT_DATA.find((c) => c.category === activeCategory)!;

  const selectVariant = (category: string, variantId: string, label: string) => {
    setActiveVariants((prev) => ({ ...prev, [category]: variantId }));
    sendToUnreal(UEEvents.EDIT_INTERIOR, { name: variantId });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-80"
      >
        <GlassCard variant="strong" className="p-0 overflow-hidden">
          {/* Header with active category name */}
          <div className="px-3 pt-3 pb-1.5 flex items-center gap-2">
            <Paintbrush className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground tracking-tight">Materials</span>
            <span className="text-[10px] text-muted-foreground ml-auto">{activeCategory}</span>
          </div>

          {/* Category icon strip — icon-only with tooltips */}
          <div className="px-2 pb-2">
            <div className="flex gap-0.5 p-0.5 rounded-lg bg-white/[0.04] overflow-x-auto scrollbar-hide">
              {VARIANT_DATA.map((cat) => {
                const isActive = activeCategory === cat.category;
                const hasSelection = !!activeVariants[cat.category];
                return (
                  <Tooltip key={cat.category}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveCategory(cat.category)}
                        className={cn(
                          "relative flex items-center justify-center w-8 h-8 shrink-0 rounded-md transition-all duration-150",
                          isActive
                            ? "bg-primary/20 text-primary shadow-sm"
                            : "text-foreground/50 hover:bg-white/[0.08] hover:text-foreground/80"
                        )}
                      >
                        {cat.icon}
                        {hasSelection && !isActive && (
                          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-[11px]">
                      {cat.category}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          {/* Options grid */}
          <ScrollArea className="max-h-[35vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="p-2.5 grid grid-cols-2 gap-1.5"
              >
                {currentCategory.options.map((opt) => {
                  const isActive = activeVariants[activeCategory] === opt.variantId;
                  return (
                    <button
                      key={opt.variantId}
                      onClick={() => selectVariant(activeCategory, opt.variantId, opt.label)}
                      className={cn(
                        "relative flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg text-[11px] font-medium transition-all duration-150 text-left",
                        isActive
                          ? "bg-primary/15 border border-primary/30 text-primary shadow-[0_0_12px_-4px_hsl(var(--primary)/0.3)]"
                          : "bg-white/[0.04] border border-white/[0.08] text-foreground/70 hover:bg-white/[0.08] hover:border-white/[0.14] hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <Check className="w-3 h-3 shrink-0 text-primary" />
                      )}
                      <span className={cn(isActive ? "" : "pl-[18px]")}>{opt.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </GlassCard>
      </motion.div>
    </TooltipProvider>
  );
}
