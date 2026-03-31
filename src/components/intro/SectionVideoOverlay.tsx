import { useState, useRef } from "react";
import { useAppFlow } from "@/contexts/AppFlowContext";
import { GlassButton } from "@/components/ui/glass-button";
import { SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTION_VIDEOS: Record<string, string> = {
  apartment: "/videos/apartments.mp4",
  villa: "/videos/villas.mp4",
};

export function SectionVideoOverlay() {
  const { selectedSection, finishSectionVideo } = useAppFlow();
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnd = () => {
    setFading(true);
    setTimeout(finishSectionVideo, 600);
  };

  const handleSkip = () => {
    setFading(true);
    setTimeout(finishSectionVideo, 600);
  };

  const videoSrc = selectedSection ? SECTION_VIDEOS[selectedSection] : "";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-[hsl(var(--background))] flex items-center justify-center transition-opacity duration-500",
        fading && "opacity-0"
      )}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        onEnded={handleEnd}
        className="w-full h-full object-cover"
      />

      {/* Section label */}
      <div className="absolute top-8 left-8">
        <span className="text-sm font-medium text-primary tracking-widest uppercase">
          {selectedSection === "apartment" ? "Residential Apartments" : "Luxury Villas"}
        </span>
      </div>

      {/* Skip button */}
      <div className="absolute bottom-8 right-8">
        <GlassButton onClick={handleSkip} className="gap-2">
          <SkipForward className="w-4 h-4" />
          Skip
        </GlassButton>
      </div>
    </div>
  );
}
