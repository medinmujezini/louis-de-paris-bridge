import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { TutorialProvider } from "@/contexts/TutorialContext";
import { ThreeDModeProvider } from "@/contexts/ThreeDModeContext";
import { AppFlowProvider } from "@/contexts/AppFlowContext";
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { CommercialOverlay } from "@/components/commercial/CommercialOverlay";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";

import HomePage from "./pages/HomePage";
import UnitsPage from "./pages/UnitsPage";
import SurroundingsPage from "./pages/SurroundingsPage";
import AdminPage from "./pages/AdminPage";
import ParkingPage from "./pages/ParkingPage";
import LokalePage from "./pages/LokalePage";
import BuildingInfoPage from "./pages/BuildingInfoPage";
import InteriorEditPage from "./pages/InteriorEditPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ThreeDModeProvider>
            <AppFlowProvider>
            <TutorialProvider>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/units" element={<UnitsPage />} />
                  <Route path="/parking" element={<ParkingPage />} />
                  <Route path="/lokale" element={<LokalePage />} />
                  <Route path="/surroundings" element={<SurroundingsPage />} />
                  <Route path="/building-info" element={<BuildingInfoPage />} />
                  <Route path="/interioredit" element={<InteriorEditPage />} />
                  <Route path="/debug" element={<Index />} />
                </Route>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <TutorialOverlay />
              <OnboardingOverlay />
              <CommercialOverlay />
            </TutorialProvider>
            </AppFlowProvider>
            </ThreeDModeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
