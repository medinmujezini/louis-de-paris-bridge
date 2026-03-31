import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLocation } from "react-router-dom";

export interface TutorialStep {
  id: string;
  targetSelector: string;
  titleKey: string;
  descriptionKey: string;
  position: "top" | "bottom" | "left" | "right";
  videoUrl?: string;
  imageKey?: string; // key to map to imported tutorial images
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  currentPageSteps: TutorialStep[];
  hasSeenWelcome: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  endTutorial: () => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

const WELCOME_STORAGE_KEY = "dino_welcome_seen";
const PAGE_TUTORIAL_PREFIX = "dino_tutorial_";

// Per-page tutorial steps with fixed positioning
export const tutorialStepsByPage: Record<string, TutorialStep[]> = {
  "/": [
    {
      id: "sidebar-toggle",
      targetSelector: '[data-tutorial="sidebar-toggle"]',
      titleKey: "sidebarToggle",
      descriptionKey: "sidebarToggleDesc",
      position: "right",
      imageKey: "sidebar",
    },
    {
      id: "sidebar-nav",
      targetSelector: '[data-tutorial="sidebar-nav"]',
      titleKey: "sidebarNav",
      descriptionKey: "sidebarNavDesc",
      position: "right",
      imageKey: "sidebar",
    },
    {
      id: "language-switcher",
      targetSelector: '[data-tutorial="language-switcher"]',
      titleKey: "language",
      descriptionKey: "languageDesc",
      position: "left",
      imageKey: "toolbar",
    },
    {
      id: "accessibility-toggle",
      targetSelector: '[data-tutorial="accessibility-toggle"]',
      titleKey: "accessibilityToggle",
      descriptionKey: "accessibilityToggleDesc",
      position: "left",
      imageKey: "toolbar",
    },
    {
      id: "help-button",
      targetSelector: '[data-tutorial="help-button"]',
      titleKey: "helpButton",
      descriptionKey: "helpButtonDesc",
      position: "left",
      imageKey: "toolbar",
    },
    {
      id: "camera-views",
      targetSelector: '[data-tutorial="camera-views"]',
      titleKey: "cameraViews",
      descriptionKey: "cameraViewsDesc",
      position: "left",
      imageKey: "camera",
    },
    {
      id: "time-controls",
      targetSelector: '[data-tutorial="time-controls"]',
      titleKey: "timeOfDay",
      descriptionKey: "timeOfDayDesc",
      position: "top",
      imageKey: "time",
    },
    {
      id: "weather-controls",
      targetSelector: '[data-tutorial="weather-controls"]',
      titleKey: "weather",
      descriptionKey: "weatherDesc",
      position: "top",
      imageKey: "weather",
    },
    {
      id: "auto-rotate",
      targetSelector: '[data-tutorial="auto-rotate"]',
      titleKey: "autoRotate",
      descriptionKey: "autoRotateDesc",
      position: "left",
      imageKey: "viewer-controls",
    },
    {
      id: "reset-camera",
      targetSelector: '[data-tutorial="reset-camera"]',
      titleKey: "resetCamera",
      descriptionKey: "resetCameraDesc",
      position: "left",
      imageKey: "viewer-controls",
    },
  ],
  "/units": [
    {
      id: "section-tabs",
      targetSelector: '[data-tutorial="section-tabs"]',
      titleKey: "sectionTabs",
      descriptionKey: "sectionTabsDesc",
      position: "left",
      imageKey: "units",
    },
    {
      id: "units-filters",
      targetSelector: '[data-tutorial="units-filters"]',
      titleKey: "filters",
      descriptionKey: "filtersDesc",
      position: "left",
      imageKey: "units",
    },
    {
      id: "available-toggle",
      targetSelector: '[data-tutorial="available-toggle"]',
      titleKey: "availableToggle",
      descriptionKey: "availableToggleDesc",
      position: "left",
      imageKey: "units",
    },
    {
      id: "unit-card",
      targetSelector: '[data-tutorial="unit-card"]',
      titleKey: "unitCard",
      descriptionKey: "unitCardDesc",
      position: "left",
      imageKey: "units",
    },
    {
      id: "unit-compare",
      targetSelector: '[data-tutorial="unit-compare"]',
      titleKey: "compare",
      descriptionKey: "compareDesc",
      position: "top",
      imageKey: "compare",
    },
  ],
  "/surroundings": [
    {
      id: "surr-movement",
      targetSelector: '[data-tutorial="surr-movement"]',
      titleKey: "surrMovement",
      descriptionKey: "surrMovementDesc",
      position: "top",
      imageKey: "surroundings",
    },
    {
      id: "surr-elevation",
      targetSelector: '[data-tutorial="surr-elevation"]',
      titleKey: "surrElevation",
      descriptionKey: "surrElevationDesc",
      position: "top",
      imageKey: "surroundings",
    },
    {
      id: "surr-map-toggle",
      targetSelector: '[data-tutorial="surr-map-toggle"]',
      titleKey: "surrMapToggle",
      descriptionKey: "surrMapToggleDesc",
      position: "top",
      imageKey: "categories",
    },
    {
      id: "surr-filter-click",
      targetSelector: '[data-tutorial="surr-filter-click"]',
      titleKey: "surrFilterClick",
      descriptionKey: "surrFilterClickDesc",
      position: "top",
      imageKey: "categories",
    },
    {
      id: "poi-search",
      targetSelector: '[data-tutorial="poi-search"]',
      titleKey: "search",
      descriptionKey: "searchDesc",
      position: "left",
      imageKey: "surroundings",
    },
    {
      id: "poi-browser",
      targetSelector: '[data-tutorial="poi-browser"]',
      titleKey: "poiBrowser",
      descriptionKey: "poiBrowserDesc",
      position: "left",
      imageKey: "surroundings",
    },
  ],
  "/parking": [
    {
      id: "parking-overview",
      targetSelector: '[data-tutorial="parking-overview"]',
      titleKey: "parkingOverview",
      descriptionKey: "parkingOverviewDesc",
      position: "left",
      imageKey: "parking",
    },
    {
      id: "parking-select",
      targetSelector: '[data-tutorial="parking-select"]',
      titleKey: "parkingSelect",
      descriptionKey: "parkingSelectDesc",
      position: "left",
      imageKey: "parking",
    },
  ],
  "/lokale": [
    {
      id: "lokale-overview",
      targetSelector: '[data-tutorial="lokale-overview"]',
      titleKey: "lokaleOverview",
      descriptionKey: "lokaleOverviewDesc",
      position: "left",
      imageKey: "lokale",
    },
    {
      id: "lokale-select",
      targetSelector: '[data-tutorial="lokale-select"]',
      titleKey: "lokaleSelect",
      descriptionKey: "lokaleSelectDesc",
      position: "left",
      imageKey: "lokale",
    },
  ],
};

function getPageTutorialKey(page: string) {
  const pageName = page === "/" ? "home" : page.replace("/", "");
  return `${PAGE_TUTORIAL_PREFIX}${pageName}`;
}

function getCompletedPages(): Set<string> {
  try {
    const stored = localStorage.getItem("dino_tutorial_completed_pages");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompletedPages(pages: Set<string>) {
  localStorage.setItem("dino_tutorial_completed_pages", JSON.stringify([...pages]));
}

interface TutorialProviderProps {
  children: ReactNode;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedPages, setCompletedPages] = useState<Set<string>>(getCompletedPages);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem(WELCOME_STORAGE_KEY) === "true";
  });
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem(WELCOME_STORAGE_KEY) !== "true";
  });

  const currentPage = location.pathname;
  const currentPageSteps = tutorialStepsByPage[currentPage] || [];

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < currentPageSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsActive(false);
      setCompletedPages((prev) => {
        const next = new Set(prev);
        next.add(currentPage);
        saveCompletedPages(next);
        return next;
      });
    }
  }, [currentStep, currentPageSteps.length, currentPage]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const skipTutorial = useCallback(() => {
    setIsActive(false);
    setShowWelcome(false);
    localStorage.setItem(WELCOME_STORAGE_KEY, "true");
    setHasSeenWelcome(true);
    setCompletedPages((prev) => {
      const next = new Set(prev);
      next.add(currentPage);
      saveCompletedPages(next);
      return next;
    });
  }, [currentPage]);

  const endTutorial = useCallback(() => {
    setIsActive(false);
    setCompletedPages((prev) => {
      const next = new Set(prev);
      next.add(currentPage);
      saveCompletedPages(next);
      return next;
    });
  }, [currentPage]);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        currentPageSteps,
        hasSeenWelcome,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        endTutorial,
        showWelcome,
        setShowWelcome,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
