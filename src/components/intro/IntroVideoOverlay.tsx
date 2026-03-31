import { useState, useRef } from "react";
import { useAppFlow } from "@/contexts/AppFlowContext";
import { GlassButton } from "@/components/ui/glass-button";
import { SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

export function IntroVideoOverlay() {
  const { skipIntro } = useAppFlow();
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnd = () => {
    setFading(true);
    setTimeout(skipIntro, 600);
  };

  const handleSkip = () => {
    setFading(true);
    setTimeout(skipIntro, 600);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-[#0A0A0A] flex items-center justify-center transition-opacity duration-500",
        fading && "opacity-0"
      )}
    >
      <video
        ref={videoRef}
        src="/videos/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleEnd}
        className="w-full h-full object-cover"
      />

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
