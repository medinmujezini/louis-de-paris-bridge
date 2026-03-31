import { useTutorial } from "@/contexts/TutorialContext";
import { GlassButton } from "@/components/ui/glass-button";
import { HelpCircle } from "lucide-react";

export function TutorialButton() {
  const { startTutorial } = useTutorial();

  return (
    <GlassButton
      variant="secondary"
      size="icon"
      onClick={startTutorial}
      title="Help & Tutorial"
    >
      <HelpCircle className="w-5 h-5" />
    </GlassButton>
  );
}
