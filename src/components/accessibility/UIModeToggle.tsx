import { useAccessibility, UIMode } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Layers, Minimize2 } from "lucide-react";

const modes: { key: UIMode; icon: typeof Layers }[] = [
  { key: "simple", icon: Minimize2 },
  { key: "complex", icon: Layers },
];

export function UIModeToggle() {
  const { uiMode, setUIMode } = useAccessibility();
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">
        {t.accessibility.uiMode.title}
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {modes.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setUIMode(key)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg border transition-all",
              uiMode === key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:bg-card"
            )}
          >
            <Icon className="w-6 h-6 mb-2" />
            <span className="font-medium text-sm">
              {t.accessibility.uiMode[key]}
            </span>
            <span className="text-xs text-muted-foreground mt-1 text-center">
              {key === "simple" ? t.accessibility.uiMode.simpleDesc : t.accessibility.uiMode.complexDesc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
