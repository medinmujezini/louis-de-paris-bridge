import { useEffect } from "react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { sendToUnreal, registerHandler, UEEvents, isMockMode } from "@/lib/ue-bridge";
import { Building2, MapPin, Palette, Send } from "lucide-react";
import uePreviewBg from "@/assets/ue-preview-bg.png";

const Index = () => {
  // Register handlers for Unreal Engine events
  useEffect(() => {
    const cleanups = [
      registerHandler(UEEvents.UPDATE_POI_LIST, (data) => {
        console.log("Received POI list from UE:", data);
      }),
      registerHandler(UEEvents.UPDATE_UNIT_LIST, (data) => {
        console.log("Received Unit list from UE:", data);
      }),
    ];

    // Request initial data
    sendToUnreal(UEEvents.REQUEST_POI_LIST);
    sendToUnreal(UEEvents.REQUEST_UNIT_LIST);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  const handleFocusUnit = () => {
    sendToUnreal(UEEvents.FOCUS_UNIT, { id: "unit-a1", animate: true });
  };

  const handleFocusPOI = () => {
    sendToUnreal(UEEvents.FOCUS_POI, { id: "dining-1", category: "dining" });
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-2rem)]">
        {isMockMode() && (
          <img
            src={uePreviewBg}
            alt=""
            className="fixed inset-0 w-screen h-screen object-cover pointer-events-none z-0"
          />
        )}
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Dino Residence <span className="text-primary">UI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive web interface for Unreal Engine architectural visualization.
            {isMockMode() && (
              <span className="block mt-2 text-sm text-primary">
                Running in mock mode - UE bridge simulated
              </span>
            )}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard className="hover:border-primary/30 transition-colors">
            <GlassCardHeader>
              <Building2 className="w-8 h-8 text-primary mb-2" />
              <GlassCardTitle>Units Browser</GlassCardTitle>
              <GlassCardDescription>
                Explore available units with detailed floor plans and specifications.
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <GlassButton onClick={handleFocusUnit} className="w-full">
                Focus Unit A1
              </GlassButton>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="hover:border-primary/30 transition-colors">
            <GlassCardHeader>
              <MapPin className="w-8 h-8 text-primary mb-2" />
              <GlassCardTitle>Points of Interest</GlassCardTitle>
              <GlassCardDescription>
                Discover nearby amenities, dining, shopping, and entertainment.
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <GlassButton onClick={handleFocusPOI} className="w-full">
                Focus Dining POI
              </GlassButton>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="hover:border-primary/30 transition-colors">
            <GlassCardHeader>
              <Palette className="w-8 h-8 text-primary mb-2" />
              <GlassCardTitle>Configurator</GlassCardTitle>
              <GlassCardDescription>
                Customize materials, colors, and finishes in real-time.
              </GlassCardDescription>
            </GlassCardHeader>
            <GlassCardContent>
              <GlassButton variant="secondary" className="w-full">
                Coming Soon
              </GlassButton>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Component Showcase */}
        <GlassCard variant="strong">
          <GlassCardHeader>
            <GlassCardTitle>Component Showcase</GlassCardTitle>
            <GlassCardDescription>
              Preview of the glassmorphism design system components.
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <GlassButton>Primary</GlassButton>
                <GlassButton variant="secondary">Secondary</GlassButton>
                <GlassButton variant="outline">Outline</GlassButton>
                <GlassButton variant="ghost">Ghost</GlassButton>
                <GlassButton variant="destructive">Destructive</GlassButton>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Input</h3>
              <div className="flex gap-3 max-w-md">
                <GlassInput placeholder="Enter search query..." />
                <GlassButton size="icon">
                  <Send className="w-4 h-4" />
                </GlassButton>
              </div>
            </div>

            {/* Card Variants */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Card Variants</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <GlassCard variant="subtle" className="p-4">
                  <p className="text-sm">Subtle variant</p>
                </GlassCard>
                <GlassCard variant="default" className="p-4">
                  <p className="text-sm">Default variant</p>
                </GlassCard>
                <GlassCard variant="strong" className="p-4">
                  <p className="text-sm">Strong variant</p>
                </GlassCard>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
      </div>
  );
};

export default Index;
