import { useEffect, useState, useCallback } from "react";
import { useTutorial } from "@/contexts/TutorialContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import tutorialBuildingImg from "@/assets/tutorial-building.png";

// Import tutorial images
import tutorialSidebar from "@/assets/tutorial/tutorial-sidebar.png";
import tutorialToolbar from "@/assets/tutorial/tutorial-toolbar.png";
import tutorialCamera from "@/assets/tutorial/tutorial-camera.png";
import tutorialTime from "@/assets/tutorial/tutorial-time.png";
import tutorialWeather from "@/assets/tutorial/tutorial-weather.png";
import tutorialViewerControls from "@/assets/tutorial/tutorial-viewer-controls.png";
import tutorialUnits from "@/assets/tutorial/tutorial-units.png";
import tutorialCompare from "@/assets/tutorial/tutorial-compare.png";
import tutorialSurroundings from "@/assets/tutorial/tutorial-surroundings.png";
import tutorialCategories from "@/assets/tutorial/tutorial-categories.png";
import tutorialParking from "@/assets/tutorial/tutorial-parking.png";
import tutorialLokale from "@/assets/tutorial/tutorial-lokale.png";

const TUTORIAL_IMAGES: Record<string, string> = {
  sidebar: tutorialSidebar,
  toolbar: tutorialToolbar,
  camera: tutorialCamera,
  time: tutorialTime,
  weather: tutorialWeather,
  "viewer-controls": tutorialViewerControls,
  units: tutorialUnits,
  compare: tutorialCompare,
  surroundings: tutorialSurroundings,
  categories: tutorialCategories,
  parking: tutorialParking,
  lokale: tutorialLokale,
};

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TutorialOverlay() {
  const { isActive, currentStep, currentPageSteps, nextStep, prevStep, skipTutorial, endTutorial } = useTutorial();
  const { t } = useLanguage();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentStepData = currentPageSteps[currentStep];
  const isLastStep = currentStep === currentPageSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const updateTargetPosition = useCallback(() => {
    if (!currentStepData?.targetSelector) return;

    const element = document.querySelector(currentStepData.targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = 8;
      setTargetRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      const tooltipWidth = 320;
      const tooltipHeight = 340;
      const margin = 16;
      let top = 0;
      let left = 0;

      switch (currentStepData.position) {
        case "top":
          top = rect.top - tooltipHeight - margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case "bottom":
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - margin;
          break;
        case "right":
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + margin;
          break;
      }

      // Clamp to viewport with margins
      left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));
      top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin));

      setTooltipPosition({ top, left });
    } else {
      setTargetRect(null);
    }
  }, [currentStepData]);

  useEffect(() => {
    if (!isActive) return;

    updateTargetPosition();
    
    const handleUpdate = () => updateTargetPosition();
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);
    
    const timeout = setTimeout(updateTargetPosition, 300);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
      clearTimeout(timeout);
    };
  }, [isActive, currentStep, updateTargetPosition]);

  if (!isActive || !currentStepData) return null;

  const titleKey = currentStepData.titleKey as keyof typeof t.tutorial;
  const descKey = currentStepData.descriptionKey as keyof typeof t.tutorial;
  const title = t.tutorial[titleKey] as string || currentStepData.titleKey;
  const description = t.tutorial[descKey] as string || currentStepData.descriptionKey;

  // Resolve image: prefer step-specific imageKey, then video, then building fallback
  const stepImage = currentStepData.imageKey ? TUTORIAL_IMAGES[currentStepData.imageKey] : null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Dark overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight glow effect */}
      {targetRect && (
        <div
          className="absolute rounded-xl border-2 border-primary animate-pulse pointer-events-none"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: "0 0 0 4px hsl(var(--primary) / 0.3), 0 0 30px hsl(var(--primary) / 0.4)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={cn(
          "absolute w-80 bg-card/95 backdrop-blur-xl rounded-2xl border border-primary/30 shadow-2xl",
          "animate-scale-in"
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {t.tutorial.progress
                .replace("{current}", String(currentStep + 1))
                .replace("{total}", String(currentPageSteps.length))}
            </p>
          </div>
          <GlassButton variant="ghost" size="icon" onClick={skipTutorial} className="h-8 w-8">
            <X className="w-4 h-4" />
          </GlassButton>
        </div>

        {/* Tutorial image */}
        <div className="px-4 pt-2">
          <div className="relative rounded-lg overflow-hidden aspect-video">
            {currentStepData.videoUrl ? (
              <video
                key={currentStepData.videoUrl}
                src={currentStepData.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={stepImage || tutorialBuildingImg}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Progress dots and navigation */}
        <div className="p-4 pt-0 flex items-center justify-between">
          <div className="flex gap-1.5 items-center">
            {currentPageSteps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentStep
                    ? "bg-primary w-4"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {!isFirstStep && (
              <GlassButton variant="ghost" size="sm" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t.tutorial.previous}
              </GlassButton>
            )}
            {isLastStep ? (
              <GlassButton size="sm" onClick={endTutorial}>
                {t.tutorial.finish}
              </GlassButton>
            ) : (
              <GlassButton size="sm" onClick={nextStep}>
                {t.tutorial.next}
                <ChevronRight className="w-4 h-4 ml-1" />
              </GlassButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
