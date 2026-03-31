import { useAccessibility, FontSize } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const fontSizes: { key: FontSize; scale: number }[] = [
  { key: "small", scale: 0.875 },
  { key: "medium", scale: 1 },
  { key: "large", scale: 1.25 },
  { key: "xlarge", scale: 1.5 },
];

export function FontSizeControl() {
  const { fontSize, setFontSize } = useAccessibility();
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-foreground">
        {t.accessibility.fontSize.title}
      </h4>
      <div className="flex gap-2">
        {fontSizes.map(({ key, scale }) => (
          <button
            key={key}
            onClick={() => setFontSize(key)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
              fontSize === key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:bg-card"
            )}
          >
            <span
              className="font-semibold mb-1"
              style={{ fontSize: `${scale * 1.25}rem` }}
            >
              Aa
            </span>
            <span className="text-xs">
              {t.accessibility.fontSize[key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
