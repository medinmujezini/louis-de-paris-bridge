import { GlassCard } from "@/components/ui/glass-card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Sun, Cloud, CloudRain, CloudFog, Sunrise, Moon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type TimeOfDay = "dawn" | "morning" | "noon" | "sunset" | "night";
type Weather = "clear" | "cloudy" | "rainy" | "foggy";

interface ViewerControlsProps {
  timeOfDay: TimeOfDay;
  weather: Weather;
  onTimeChange: (time: TimeOfDay) => void;
  onWeatherChange: (weather: Weather) => void;
  compact?: boolean;
}

const timeValues: TimeOfDay[] = ["dawn", "morning", "noon", "sunset", "night"];

const weatherIcons: Record<Weather, React.ComponentType<{ className?: string }>> = {
  clear: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  foggy: CloudFog,
};

const getTimeIcon = (time: TimeOfDay) => {
  switch (time) {
    case "dawn":
    case "sunset":
      return Sunrise;
    case "night":
      return Moon;
    default:
      return Sun;
  }
};

export function ViewerControls({ timeOfDay, weather, onTimeChange, onWeatherChange, compact = false }: ViewerControlsProps) {
  const { t } = useLanguage();
  const currentTimeIndex = timeValues.indexOf(timeOfDay);
  const TimeIcon = getTimeIcon(timeOfDay);

  const timeLabels: Record<TimeOfDay, string> = {
    dawn: t.home.time.dawn,
    morning: t.home.time.morning,
    noon: t.home.time.noon,
    sunset: t.home.time.sunset,
    night: t.home.time.night,
  };

  const weatherOptions: { id: Weather; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "clear", label: t.home.weather.clear, icon: weatherIcons.clear },
    { id: "cloudy", label: t.home.weather.cloudy, icon: weatherIcons.cloudy },
    { id: "rainy", label: t.home.weather.rainy, icon: weatherIcons.rainy },
    { id: "foggy", label: t.home.weather.foggy, icon: weatherIcons.foggy },
  ];

  const handleSliderChange = (value: number[]) => {
    const index = Math.round(value[0]);
    if (index >= 0 && index < timeValues.length) {
      onTimeChange(timeValues[index]);
    }
  };

  // Compact: single-row layout for interior HUD
  if (compact) {
    return (
      <div className="p-3 rounded-xl bg-[hsl(0,0%,4%)] border border-primary/20" data-tutorial="viewer-controls-compact">
        <div className="flex items-center gap-4">
          {/* Time slider */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <TimeIcon className="w-4 h-4 text-primary shrink-0" />
            <Slider
              min={0}
              max={timeValues.length - 1}
              step={1}
              value={[currentTimeIndex]}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <span className="text-xs font-medium text-foreground whitespace-nowrap w-14 text-right">
              {timeLabels[timeOfDay]}
            </span>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-white/10 shrink-0" />

          {/* Weather buttons */}
          <div className="flex gap-1">
            {weatherOptions.map((option) => {
              const Icon = option.icon;
              const isActive = weather === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onWeatherChange(option.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-white/10 text-muted-foreground"
                  )}
                  title={option.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Default: stacked layout for home page
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col gap-3">
      {/* Time of Day Slider */}
      <div className="p-3 min-w-[280px] rounded-xl bg-[hsl(0,0%,4%)] border border-primary/20" data-tutorial="time-controls">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t.home.time.title}</span>
            <div className="flex items-center gap-1.5">
              <TimeIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{timeLabels[timeOfDay]}</span>
            </div>
          </div>
          <Slider
            min={0}
            max={timeValues.length - 1}
            step={1}
            value={[currentTimeIndex]}
            onValueChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{t.home.time.dawn}</span>
            <span>{t.home.time.noon}</span>
            <span>{t.home.time.night}</span>
          </div>
        </div>
      </div>

      {/* Weather Controls */}
      <GlassCard variant="strong" className="p-2" data-tutorial="weather-controls">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground px-2 hidden sm:block">{t.home.weather.title}</span>
          <div className="flex gap-1">
            {weatherOptions.map((option) => {
              const Icon = option.icon;
              const isActive = weather === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onWeatherChange(option.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-white/10 text-muted-foreground"
                  )}
                  title={option.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium hidden md:block">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
