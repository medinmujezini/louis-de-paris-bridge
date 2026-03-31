import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { GlassButton } from "@/components/ui/glass-button";
import { FontSizeControl } from "./FontSizeControl";
import { UIModeToggle } from "./UIModeToggle";
import { VoiceRecognition } from "./VoiceRecognition";
import { VoiceHelper } from "./VoiceHelper";
import { RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AccessibilityPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccessibilityPanel({ open, onOpenChange }: AccessibilityPanelProps) {
  const { t } = useLanguage();
  const { resetToDefaults } = useAccessibility();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto glass-strong">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">
            {t.accessibility.title}
          </SheetTitle>
          <SheetDescription>
            {t.accessibility.description}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Font Size */}
          <FontSizeControl />

          <Separator className="bg-border/50" />

          {/* UI Mode */}
          <UIModeToggle />

          <Separator className="bg-border/50" />

          {/* Voice Recognition */}
          <VoiceRecognition />

          <Separator className="bg-border/50" />

          {/* Voice Helper */}
          <VoiceHelper />

          <Separator className="bg-border/50" />

          {/* Reset Button */}
          <GlassButton
            variant="secondary"
            onClick={resetToDefaults}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.accessibility.reset}
          </GlassButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
