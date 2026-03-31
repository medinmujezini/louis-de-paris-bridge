import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAppFlow } from "@/contexts/AppFlowContext";
import { Home, Building2, Car, Store, Trees, Info, X, Mouse, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "move" | "zoom" | "sidebar" | "complete";

const ONBOARDING_KEY = "dino_onboarding_complete";

const sidebarItems = [
  { id: "home", icon: Home, labelKey: "home" as const, descKey: "homeDesc" as const },
  { id: "units", icon: Building2, labelKey: "units" as const, descKey: "unitsDesc" as const },
  { id: "parking", icon: Car, labelKey: "parking" as const, descKey: "parkingDesc" as const },
  { id: "lokale", icon: Store, labelKey: "lokale" as const, descKey: "lokaleDesc" as const },
  { id: "surroundings", icon: Trees, labelKey: "surroundings" as const, descKey: "surroundingsDesc" as const },
  { id: "building-info", icon: Info, labelKey: "buildingInfo" as const, descKey: "buildingInfoDesc" as const },
];

export function OnboardingOverlay() {
  const { t } = useLanguage();
  const location = useLocation();
  const { phase: flowPhase } = useAppFlow();

  const [phase, setPhase] = useState<Phase>(() => {
    // TODO: remove this bypass after testing — always show onboarding on reload
    // if (localStorage.getItem(ONBOARDING_KEY) === "true") return "complete";
    return "move";
  });
  const [sidebarIndex, setSidebarIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const mouseDownRef = useRef(false);
  const moveDetectedRef = useRef(false);
  const wheelDetectedRef = useRef(false);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setFading(true);
    setTimeout(() => setPhase("complete"), 500);
  }, []);

  const skip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const transitionTo = useCallback((next: Phase) => {
    setFading(true);
    setTimeout(() => {
      setPhase(next);
      setFading(false);
    }, 500);
  }, []);

  // Phase 1: Move detection
  useEffect(() => {
    if (phase !== "move") return;
    const handleDown = () => { mouseDownRef.current = true; };
    const handleUp = () => { mouseDownRef.current = false; };
    const handleMove = () => {
      if (mouseDownRef.current && !moveDetectedRef.current) {
        moveDetectedRef.current = true;
        transitionTo("zoom");
      }
    };
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchstart", handleDown);
    document.addEventListener("touchend", handleUp);
    document.addEventListener("touchmove", handleMove);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchstart", handleDown);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("touchmove", handleMove);
    };
  }, [phase, transitionTo]);

  // Phase 2: Zoom detection
  useEffect(() => {
    if (phase !== "zoom") return;
    const handleWheel = () => {
      if (!wheelDetectedRef.current) {
        wheelDetectedRef.current = true;
        transitionTo("sidebar");
      }
    };
    document.addEventListener("wheel", handleWheel);
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [phase, transitionTo]);

  const handleSidebarNext = useCallback(() => {
    if (sidebarIndex >= sidebarItems.length - 1) {
      completeOnboarding();
    } else {
      setSidebarIndex((prev) => prev + 1);
    }
  }, [sidebarIndex, completeOnboarding]);

  // Don't show main onboarding on interior edit route (has its own onboarding)
  if (location.pathname === "/interioredit") return null;
  if (flowPhase !== "browsing") return null;
  if (phase === "complete") return null;

  const isLastTab = sidebarIndex >= sidebarItems.length - 1;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] transition-opacity duration-500",
        fading ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Skip button — always visible */}
      <button
        onClick={skip}
        className="absolute top-5 right-5 z-[210] flex items-center gap-2 px-4 py-2 rounded-full 
                   bg-white/10 backdrop-blur-md border border-white/20 
                   text-sm text-white/70 hover:text-white hover:bg-white/20 
                   transition-all duration-200"
      >
        <X className="w-4 h-4" />
        {t.onboarding.skip}
      </button>

      {/* Phase 1: Move — shows a mouse/cursor icon */}
      {phase === "move" && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8 animate-fade-in">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-[pulse_2s_ease-in-out_infinite]" />
              <div className="absolute inset-3 rounded-full border border-white/10 animate-[pulse_2s_ease-in-out_infinite_0.5s]" />
              <div className="animate-onboarding-drag">
                <Mouse className="w-16 h-16 text-white" strokeWidth={1.2} />
              </div>
            </div>

            <div className="glass-card glass-card--strong px-8 py-4 text-center relative max-w-sm">
              <div className="glass-card__light-bar glass-card__light-bar--strong" />
              <p className="text-lg font-semibold text-foreground">
                {t.onboarding.dragToMove}
              </p>
              <div className="flex justify-center gap-3 mt-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Zoom — scroll mouse icon */}
      {phase === "zoom" && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8 animate-fade-in">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-[pulse_2s_ease-in-out_infinite]" />
              
              <div className="flex flex-col items-center gap-1">
                <svg width="20" height="12" viewBox="0 0 20 12" className="animate-onboarding-scroll-arrow-up">
                  <path d="M10 2 L3 9 L17 9 Z" fill="white" opacity="0.5" />
                </svg>
                <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
                  <rect x="2" y="2" width="36" height="56" rx="18" stroke="white" strokeWidth="2" />
                  <rect x="17" y="12" width="6" height="14" rx="3" fill="white" className="animate-onboarding-scroll" />
                </svg>
                <svg width="20" height="12" viewBox="0 0 20 12" className="animate-onboarding-scroll-arrow-down">
                  <path d="M10 10 L3 3 L17 3 Z" fill="white" opacity="0.5" />
                </svg>
              </div>
            </div>

            <div className="glass-card glass-card--strong px-8 py-4 text-center relative max-w-sm">
              <div className="glass-card__light-bar glass-card__light-bar--strong" />
              <p className="text-lg font-semibold text-foreground">
                {t.onboarding.scrollToZoom}
              </p>
              <div className="flex justify-center gap-3 mt-3">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Sidebar tabs — user clicks Next to advance */}
      {phase === "sidebar" && (
        <>
          <div className="absolute inset-0 bg-black/60" />
          
          <div className="absolute left-[16px] top-[16px] bottom-[16px] w-[70px] z-[202]">
            <div className="absolute inset-0 rounded-xl bg-black/20 backdrop-blur-sm" />
            
            <div className="relative flex flex-col items-center gap-1 pt-[120%]">
              {sidebarItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = idx === sidebarIndex;
                const isPast = idx < sidebarIndex;
                return (
                  <div
                    key={item.id}
                    className="relative flex items-center justify-center w-full"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500",
                        isActive
                          ? "bg-primary/30 scale-110 shadow-[0_0_24px_hsl(7,85%,36%,0.6)]"
                          : isPast
                          ? "opacity-50"
                          : "opacity-25"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>

                    {/* Tooltip card with Next button */}
                    {isActive && (
                      <div className="absolute left-[75px] top-1/2 -translate-y-1/2 animate-fade-in">
                        {/* Arrow */}
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 
                                        border-t-[8px] border-t-transparent 
                                        border-r-[8px] border-r-white/20 
                                        border-b-[8px] border-b-transparent" />
                        <div className="glass-card glass-card--strong px-5 py-3 min-w-[240px] relative ml-0">
                          <div className="glass-card__light-bar glass-card__light-bar--strong" />
                          <p className="font-semibold text-foreground text-sm">
                            {t.onboarding.tabs[item.labelKey]}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {t.onboarding.tabs[item.descKey]}
                          </p>
                          {/* Next / Finish button */}
                          <button
                            onClick={handleSidebarNext}
                            className="mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg 
                                       bg-primary hover:bg-primary/90 
                                       text-sm font-semibold text-primary-foreground transition-colors
                                       shadow-lg shadow-primary/30"
                          >
                            {isLastTab ? t.tutorial.finish : t.tutorial.next}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          {/* Tab progress */}
                          <div className="flex justify-center gap-1.5 mt-2">
                            {sidebarItems.map((_, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full transition-colors",
                                  i === sidebarIndex ? "bg-primary" : i < sidebarIndex ? "bg-primary/40" : "bg-white/15"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Phase progress dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
