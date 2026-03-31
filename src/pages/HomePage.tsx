import { useState, useEffect } from "react";
import { ViewerControls } from "@/components/home/ViewerControls";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Building2, Plane, Eye, RotateCcw, RotateCw, ArrowLeft } from "lucide-react";
import { sendToUnreal, registerHandler, UEEvents } from "@/lib/ue-bridge";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAppFlow } from "@/contexts/AppFlowContext";
import { IntroVideoOverlay } from "@/components/intro/IntroVideoOverlay";
import { SectionSelector } from "@/components/home/SectionSelector";

type TimeOfDay = "dawn" | "morning" | "noon" | "sunset" | "night";
type Weather = "clear" | "cloudy" | "rainy" | "foggy";

export default function HomePage() {
  const { t } = useLanguage();
  const { phase, backToSections } = useAppFlow();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("sunset");
  const [weather, setWeather] = useState<Weather>("cloudy");
  const [autoRotate, setAutoRotate] = useState(false);

  const handleTimeChange = (time: TimeOfDay) => {
    setTimeOfDay(time);
    sendToUnreal(UEEvents.SET_TIME_OF_DAY, { time });
  };

  const handleWeatherChange = (newWeather: Weather) => {
    setWeather(newWeather);
    sendToUnreal(UEEvents.SET_WEATHER, { weather: newWeather });
  };

  const handleCameraView = (view: string) => {
    sendToUnreal(UEEvents.SET_CAMERA_VIEW, { view });
  };

  const handleAutoRotateToggle = () => {
    const newValue = !autoRotate;
    setAutoRotate(newValue);
    sendToUnreal(UEEvents.TOGGLE_AUTO_ROTATE, { enabled: newValue });
  };

  const handleResetCamera = () => {
    sendToUnreal(UEEvents.RESET_CAMERA, {});
  };

  useEffect(() => {
    const unsubscribeTime = registerHandler(UEEvents.TIME_CHANGED, (data) => {
      setTimeOfDay((data as { time: TimeOfDay }).time);
    });
    const unsubscribeWeather = registerHandler(UEEvents.WEATHER_CHANGED, (data) => {
      setWeather((data as { weather: Weather }).weather);
    });
    return () => {
      unsubscribeTime();
      unsubscribeWeather();
    };
  }, []);

  // Intro phase
  if (phase === "intro") {
    return <IntroVideoOverlay />;
  }

  // Section selector phase
  if (phase === "section-select") {
    return <SectionSelector />;
  }

  // Browsing phase — show camera/weather controls
  return (
    <div className="relative w-full h-[calc(100vh-6rem)]">

      {/* Back to sections */}
      <div className="absolute top-4 left-4 z-10">
        <GlassButton onClick={backToSections} className="gap-2" size="sm">
          <ArrowLeft className="w-4 h-4" />
          {t.common.back}
        </GlassButton>
      </div>

      {/* Top-right: Camera presets */}
      <div className="absolute top-4 right-4 z-10" data-tutorial="camera-views">
        <GlassCard variant="strong" className="p-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{t.home.cameraViews.title}</span>
            <div className="flex gap-2">
              <GlassButton size="sm" onClick={() => handleCameraView("exterior")} title={t.home.cameraViews.exterior}>
                <Building2 className="w-4 h-4" />
              </GlassButton>
              <GlassButton size="sm" onClick={() => handleCameraView("aerial")} title={t.home.cameraViews.aerial}>
                <Plane className="w-4 h-4" />
              </GlassButton>
              <GlassButton size="sm" onClick={() => handleCameraView("street")} title={t.home.cameraViews.street}>
                <Eye className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bottom: Time & Weather Controls */}
      <ViewerControls
        timeOfDay={timeOfDay}
        weather={weather}
        onTimeChange={handleTimeChange}
        onWeatherChange={handleWeatherChange}
      />

      {/* Bottom-right: Camera controls */}
      <div className="absolute bottom-6 right-4 z-10">
        <div className="glass-card glass-card--strong flex flex-col gap-2 p-3 relative">
          <div className="glass-card__light-bar glass-card__light-bar--strong" />
          <div data-tutorial="auto-rotate">
            <GlassButton
              variant={autoRotate ? "default" : "ghost"}
              size="sm"
              onClick={handleAutoRotateToggle}
              title={t.home.controls.autoRotate}
            >
              <RotateCw className="w-4 h-4 mr-2" />
              {t.home.controls.autoRotate}
            </GlassButton>
          </div>
          <div data-tutorial="reset-camera">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={handleResetCamera}
              title={t.home.controls.resetView}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.home.controls.resetView}
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
}
