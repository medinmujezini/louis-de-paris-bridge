import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { GlassButton } from "@/components/ui/glass-button";
import { Volume2, Play, Square } from "lucide-react";
import { useState, useEffect } from "react";

export function VoiceHelper() {
  const {
    voiceHelperEnabled,
    setVoiceHelperEnabled,
    voiceHelperSpeed,
    setVoiceHelperSpeed,
    speak,
    stopSpeaking,
    isSpeaking,
  } = useAccessibility();
  const { t } = useLanguage();
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(typeof speechSynthesis !== "undefined");
  }, []);

  const handleReadPage = () => {
    const content = document.querySelector("main")?.textContent || "";
    const cleanedContent = content.replace(/\s+/g, " ").trim().slice(0, 1000);
    speak(cleanedContent);
  };

  if (!isSupported) {
    return (
      <div className="space-y-3 opacity-50">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          {t.accessibility.voice.helper}
        </h4>
        <p className="text-xs text-muted-foreground">
          {t.accessibility.voice.notSupported}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            {t.accessibility.voice.helper}
          </h4>
          <p className="text-xs text-muted-foreground">
            {t.accessibility.voice.helperDesc}
          </p>
        </div>
        <Switch
          checked={voiceHelperEnabled}
          onCheckedChange={setVoiceHelperEnabled}
        />
      </div>

      {voiceHelperEnabled && (
        <div className="space-y-4 pl-2 border-l-2 border-primary/20">
          {/* Speed control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {t.accessibility.voice.speed}
              </span>
              <span className="text-xs font-medium text-foreground">
                {voiceHelperSpeed.toFixed(1)}x
              </span>
            </div>
            <Slider
              value={[voiceHelperSpeed]}
              onValueChange={([value]) => setVoiceHelperSpeed(value)}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Control buttons */}
          <div className="flex gap-2">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={handleReadPage}
              disabled={isSpeaking}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              {t.accessibility.voice.readPage}
            </GlassButton>
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={stopSpeaking}
              disabled={!isSpeaking}
            >
              <Square className="w-4 h-4" />
            </GlassButton>
          </div>
        </div>
      )}
    </div>
  );
}
