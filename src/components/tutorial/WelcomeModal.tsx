import { useTutorial } from "@/contexts/TutorialContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Sparkles, X, Rocket, Map, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WelcomeModal() {
  const { showWelcome, setShowWelcome, skipTutorial } = useTutorial();
  const { t } = useLanguage();

  if (!showWelcome) return null;

  const handleDismiss = () => {
    setShowWelcome(false);
    localStorage.setItem("dino_welcome_seen", "true");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      <GlassCard
        variant="strong"
        className={cn(
          "relative w-full max-w-md p-6 animate-scale-in",
          "border-primary/30"
        )}
      >
        <GlassButton
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="absolute top-4 right-4"
        >
          <X className="w-4 h-4" />
        </GlassButton>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t.tutorial.welcome}
          </h2>
          <p className="text-muted-foreground">
            {t.tutorial.welcomeDesc}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{t.tutorial.feature1}</p>
              <p className="text-xs text-muted-foreground">{t.tutorial.feature1Desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Map className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{t.tutorial.feature2}</p>
              <p className="text-xs text-muted-foreground">{t.tutorial.feature2Desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{t.tutorial.feature3}</p>
              <p className="text-xs text-muted-foreground">{t.tutorial.feature3Desc}</p>
            </div>
          </div>
        </div>

        <GlassButton onClick={handleDismiss} className="w-full">
          <Rocket className="w-4 h-4 mr-2" />
          {t.tutorial.letsGo}
        </GlassButton>
      </GlassCard>
    </div>
  );
}
