import { useState, useEffect, useRef, useCallback } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { Move, RotateCw, X, Check } from "lucide-react";

export interface ObjectVariant {
  id: string;
  label: string;
  thumbnail?: string;
}

export interface MaterialSlot {
  slot: number;
  name: string;
}

export interface SelectedObjectData {
  actor: string;
  materials: MaterialSlot[];
  position: { x: number; y: number };
  variants?: ObjectVariant[];
  currentVariant?: string;
}

interface InteriorContextMenuProps {
  objectData: SelectedObjectData;
  position: { x: number; y: number };
  onClose: () => void;
  onMoveActivated: () => void;
}

const PRESET_COLORS = [
  "#FFFFFF", "#F5F0EB", "#E8E0D8", "#D4C5B5",
  "#8B7355", "#5C4033", "#2C2C2C", "#1A1A1A",
  "#C0392B", "#2980B9",
];

export function InteriorContextMenu({ objectData, position, onClose, onMoveActivated }: InteriorContextMenuProps) {
  const [activeSlot, setActiveSlot] = useState(0);
  const [activeColor, setActiveColor] = useState(PRESET_COLORS[2]);
  const [customHex, setCustomHex] = useState("");
  const [activeVariant, setActiveVariant] = useState(objectData.currentVariant ?? "");
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  const hasVariants = objectData.variants && objectData.variants.length > 0;
  const hasMultipleSlots = objectData.materials.length > 1;

  // Reposition if overflowing viewport
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    let x = position.x;
    let y = position.y;
    if (x + rect.width > window.innerWidth - 16) x = window.innerWidth - rect.width - 16;
    if (y + rect.height > window.innerHeight - 16) y = window.innerHeight - rect.height - 16;
    if (x < 16) x = 16;
    if (y < 16) y = 16;
    setAdjustedPos({ x, y });
  }, [position]);

  // Dismiss on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener("mousedown", handleClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleClose = useCallback(() => {
    sendToUnreal(UEEvents.CANCEL_INTERACTION, {});
    onClose();
  }, [onClose]);

  const handleColorSelect = useCallback((color: string) => {
    setActiveColor(color);
    setCustomHex(color);
    sendToUnreal(UEEvents.SET_OBJECT_MATERIAL, { slot: activeSlot, color });
  }, [activeSlot]);

  const handleHexSubmit = useCallback(() => {
    if (/^#[0-9A-Fa-f]{6}$/.test(customHex)) {
      handleColorSelect(customHex);
    }
  }, [customHex, handleColorSelect]);

  const handleVariantSelect = useCallback((variantId: string) => {
    setActiveVariant(variantId);
    sendToUnreal(UEEvents.SET_OBJECT_VARIANT, { variantId });
  }, []);

  const handleMove = useCallback(() => {
    sendToUnreal(UEEvents.MOVE_OBJECT, {});
    onMoveActivated();
  }, [onMoveActivated]);

  const handleRotate = useCallback(() => {
    sendToUnreal(UEEvents.ROTATE_OBJECT, {});
  }, []);

  return (
    <div
      ref={menuRef}
      className="fixed z-[60] pointer-events-auto"
      style={{ left: adjustedPos.x, top: adjustedPos.y }}
    >
      <GlassCard variant="strong" className="min-w-[220px] max-w-[280px]">
        {/* Header */}
        <div className="p-3 pb-0 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground truncate">{objectData.actor}</h4>
            <p className="text-[11px] text-muted-foreground">
              {objectData.materials.length} material slot{objectData.materials.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

          {hasVariants ? (
            /* Variant selector */
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Variants</span>
              <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto scrollbar-thin">
                {objectData.variants!.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantSelect(v.id)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition-all duration-150 text-left ${
                      activeVariant === v.id
                        ? "bg-primary/20 border border-primary/40 text-primary"
                        : "hover:bg-white/10 text-foreground border border-transparent"
                    }`}
                  >
                    {v.thumbnail && (
                      <img src={v.thumbnail} alt={v.label} className="w-8 h-8 rounded object-cover" />
                    )}
                    <span className="flex-1 truncate">{v.label}</span>
                    {activeVariant === v.id && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Color picker with slot selector */
            <div className="space-y-2">
              {/* Material slot selector */}
              {hasMultipleSlots && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Slot</span>
                  <div className="flex gap-1 flex-wrap">
                    {objectData.materials.map((mat) => (
                      <button
                        key={mat.slot}
                        onClick={() => setActiveSlot(mat.slot)}
                        className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all duration-150 ${
                          activeSlot === mat.slot
                            ? "bg-primary/20 border border-primary/40 text-primary"
                            : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        }`}
                        title={mat.name}
                      >
                        {mat.name.replace(/^M_/, '').replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Color</span>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-8 h-8 rounded-md border-2 transition-all duration-150 hover:scale-110 ${
                      activeColor === color ? "border-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" : "border-white/10"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              {/* Custom hex input */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => setCustomHex(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHexSubmit()}
                  placeholder="#RRGGBB"
                  maxLength={7}
                  className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 font-mono focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={handleHexSubmit}
                  className="p-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

          {/* Move & Rotate */}
          <div className="flex gap-2">
            <button
              onClick={handleMove}
              className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
            >
              <Move className="w-3.5 h-3.5" />
              Move
            </button>
            <button
              onClick={handleRotate}
              className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Rotate 90°
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
