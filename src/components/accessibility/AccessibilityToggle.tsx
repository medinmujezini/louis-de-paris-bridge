import { useState } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import { Accessibility } from "lucide-react";
import { AccessibilityPanel } from "./AccessibilityPanel";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

export function AccessibilityToggle() {
  const [open, setOpen] = useState(false);
  const { fontSize, uiMode, voiceRecognitionEnabled, voiceHelperEnabled } =
    useAccessibility();

  // Check if any non-default settings are active
  const hasActiveSettings =
    fontSize !== "medium" ||
    uiMode !== "complex" ||
    voiceRecognitionEnabled ||
    voiceHelperEnabled;

  return (
    <>
      <GlassButton
        variant="secondary"
        size="icon"
        onClick={() => setOpen(true)}
        title="Accessibility Settings"
        className="relative"
      >
        <Accessibility className="w-5 h-5" />
        {hasActiveSettings && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full" />
        )}
      </GlassButton>
      <AccessibilityPanel open={open} onOpenChange={setOpen} />
    </>
  );
}
