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


      {/* Top-right: Camera presets */}
      <div className="absolute top-4 right-4 z-10" data-tutorial="camera-views">
        <div className="p-3 rounded-xl bg-[hsl(0,0%,4%)] border border-primary/20">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{t.home.cameraViews.title}</span>
            <div className="flex gap-2">
              <button onClick={() => handleCameraView("exterior")} title={t.home.cameraViews.exterior} className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/25 transition-colors">
                <Building2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleCameraView("aerial")} title={t.home.cameraViews.aerial} className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/25 transition-colors">
                <Plane className="w-4 h-4" />
              </button>
              <button onClick={() => handleCameraView("street")} title={t.home.cameraViews.street} className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/25 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
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
        <div className="flex flex-col gap-2 p-3 relative rounded-xl bg-[hsl(0,0%,4%)] border border-primary/20">
          <div className="absolute top-0 left-[25%] w-[50%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
          <div data-tutorial="auto-rotate">
            <button
              onClick={handleAutoRotateToggle}
              title={t.home.controls.autoRotate}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                autoRotate ? "bg-primary text-primary-foreground" : "text-primary hover:bg-primary/15"
              )}
            >
              <RotateCw className="w-4 h-4" />
              {t.home.controls.autoRotate}
            </button>
          </div>
          <div data-tutorial="reset-camera">
            <button
              onClick={handleResetCamera}
              title={t.home.controls.resetView}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/15 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t.home.controls.resetView}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
