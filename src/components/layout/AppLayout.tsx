import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AnimatedOutlet } from "./AnimatedOutlet";
import { GlassButton } from "@/components/ui/glass-button";
import { Menu, Bug } from "lucide-react";
import { cn } from "@/lib/utils";
import { isMockMode, getEventLog, sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AccessibilityToggle } from "@/components/accessibility/AccessibilityToggle";
import { TutorialButton } from "@/components/tutorial/TutorialButton";
import { DinoBot } from "@/components/chat/DinoBot";
import { useThreeDMode } from "@/contexts/ThreeDModeContext";
import { useAppFlow } from "@/contexts/AppFlowContext";

import uePreviewBg from "@/assets/ue-preview-bg.png";

export function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [dinoBotOpen, setDinoBotOpen] = useState(false);
  const threeDMode = useThreeDMode();
  const { phase } = useAppFlow();
  const prevPathRef = useRef(location.pathname);
  const hideChrome = phase === "intro" || phase === "section-select";

  // Map routes to UE category identifiers
  const routeToCategoryMap: Record<string, string> = {
    "/": "home",
    "/units": "units",
    "/parking": "parking",
    "/lokale": "lokale",
    "/surroundings": "surroundings",
    "/building-info": "building-info",
    "/admin": "admin",
  };

  // Activation event map per category
  const activationEvents: Record<string, { activate: string; deactivate: string }> = {
    home: { activate: UEEvents.ACTIVATE_HOME, deactivate: UEEvents.DEACTIVATE_HOME },
    units: { activate: UEEvents.ACTIVATE_UNITS, deactivate: UEEvents.DEACTIVATE_UNITS },
    parking: { activate: UEEvents.ACTIVATE_PARKING, deactivate: UEEvents.DEACTIVATE_PARKING },
    lokale: { activate: UEEvents.ACTIVATE_LOKALE, deactivate: UEEvents.DEACTIVATE_LOKALE },
    surroundings: { activate: UEEvents.ACTIVATE_SURROUNDINGS, deactivate: UEEvents.DEACTIVATE_SURROUNDINGS },
    "building-info": { activate: UEEvents.ACTIVATE_BUILDING_INFO, deactivate: UEEvents.DEACTIVATE_BUILDING_INFO },
  };

  // Send bridge events on route change
  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;
    prevPathRef.current = curr;

    if (prev === curr) return;

    const category = routeToCategoryMap[curr] || "home";
    const prevCategory = routeToCategoryMap[prev];

    // Notify UE which tab/page is now active
    sendToUnreal(UEEvents.NAVIGATE_CATEGORY, { category });

    // Deactivate previous tab
    if (prevCategory && activationEvents[prevCategory]) {
      sendToUnreal(activationEvents[prevCategory].deactivate, {});
    }

    // Activate current tab
    if (activationEvents[category]) {
      sendToUnreal(activationEvents[category].activate, {});
    }
  }, [location.pathname]);

  const isInteriorEdit = location.pathname === "/interioredit";
  const effectiveSidebarOpen = (threeDMode.active || isInteriorEdit || hideChrome) ? false : sidebarOpen;

  const handleNavigate = (itemId: string) => {
    console.log("Navigate to:", itemId);
  };

  return (
    <div className="min-h-screen w-full flex bg-transparent">
      {/* Persistent background for mock mode */}
      {isMockMode() && (
        <img
          src={uePreviewBg}
          alt=""
          className="fixed inset-0 w-screen h-screen object-cover pointer-events-none z-0"
        />
      )}

      {/* Left gradient overlay */}
      <div
        className="fixed inset-y-0 left-0 w-[30vw] pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to right, black 0%, rgba(0,0,0,0.7) 40%, transparent 100%)" }}
      />
      {/* Bottom gradient overlay */}
      <div
        className="fixed inset-x-0 bottom-0 h-[30vh] pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, black 0%, rgba(0,0,0,0.7) 40%, transparent 100%)" }}
      />
      {/* Right gradient overlay */}
      <div
        className="fixed inset-y-0 right-0 w-[30vw] pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to left, black 0%, rgba(0,0,0,0.7) 40%, transparent 100%)" }}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-500 ease-in-out",
          effectiveSidebarOpen && !isInteriorEdit ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        )}
      >
        <AppSidebar
          onNavigate={handleNavigate}
          onDinoBotToggle={() => setDinoBotOpen((prev) => !prev)}
          dinoBotActive={dinoBotOpen}
        />
      </aside>

      {/* Mobile overlay */}
      {effectiveSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          effectiveSidebarOpen ? "lg:ml-64" : "ml-0"
        )}
      >
        {/* Top bar with toggle */}
        {!isInteriorEdit && (
          <header className={cn(
            "fixed top-0 left-0 right-0 z-20 p-4 transition-opacity duration-300",
            (threeDMode.phase === "interior" || threeDMode.phase === "exiting-loading" || threeDMode.phase === "exiting-video") && "opacity-0 pointer-events-none"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {!effectiveSidebarOpen && !threeDMode.active && (
                  <GlassButton
                    variant="secondary"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    data-tutorial="sidebar-toggle"
                  >
                    <Menu className="w-5 h-5" />
                  </GlassButton>
                )}
              </div>

              <div className="glass-card glass-card--strong flex items-center gap-2 px-3 py-2 relative">
                <div className="glass-card__light-bar glass-card__light-bar--strong" />
                <div data-tutorial="help-button">
                  <TutorialButton />
                </div>
                <div data-tutorial="accessibility-toggle">
                  <AccessibilityToggle />
                </div>
                <div data-tutorial="language-switcher">
                  <LanguageSwitcher />
                </div>
                {isMockMode() && (
                  <GlassButton
                    variant={showDebug ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setShowDebug(!showDebug)}
                    title="Toggle Debug Panel"
                  >
                    <Bug className="w-5 h-5" />
                  </GlassButton>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Animated page content */}
        <div className={cn("relative z-[2]", !isInteriorEdit && "pt-20 px-4 pb-4")}>
          <AnimatedOutlet />
        </div>

        {/* Debug panel */}
        {showDebug && (
          <div className="fixed bottom-4 right-4 w-96 max-h-64 overflow-auto rounded-lg bg-card/95 backdrop-blur-xl border border-white/10 p-4 z-50">
            <h3 className="text-sm font-semibold mb-2 text-foreground">
              UE Bridge Log
            </h3>
            <div className="space-y-1 text-xs font-mono">
              {getEventLog()
                .slice(-10)
                .reverse()
                .map((log, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-1 rounded",
                      log.direction === "to-ue"
                        ? "bg-primary/20 text-primary"
                        : "bg-green-500/20 text-green-400"
                    )}
                  >
                    <span className="opacity-50">
                      {log.timestamp.toLocaleTimeString()}
                    </span>{" "}
                    <span className="font-semibold">{log.event}</span>
                  </div>
                ))}
              {getEventLog().length === 0 && (
                <p className="text-muted-foreground">No events yet</p>
              )}
            </div>
          </div>
        )}

        {/* DinoBot chatbot */}
        <DinoBot open={dinoBotOpen} onClose={() => setDinoBotOpen(false)} />

      </main>
    </div>
  );
}
