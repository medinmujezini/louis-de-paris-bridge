import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import { Volume2, VolumeX } from "lucide-react";

// Default inactivity timeout: 2 minutes (120000ms)
const INACTIVITY_TIMEOUT = 120000;

// Placeholder video - replace with your commercial video URL
const COMMERCIAL_VIDEO_URL = "/videos/commercial.mp4";

// Fallback: If no video file exists, show a branded screensaver
const SHOW_FALLBACK_SCREENSAVER = true;

export const CommercialOverlay = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);

  const { isInactive, dismiss } = useInactivityTimer({
    timeout: INACTIVITY_TIMEOUT,
  });

  // Handle video errors (file not found)
  const handleVideoError = () => {
    setHasVideo(false);
  };

  // Reset and play video when becoming inactive
  useEffect(() => {
    if (isInactive && videoRef.current && hasVideo) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay blocked, that's fine
      });
    }
  }, [isInactive, hasVideo]);

  // Handle any interaction to dismiss
  const handleInteraction = () => {
    dismiss();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted(!muted);
    if (videoRef.current) {
      videoRef.current.muted = !muted;
    }
  };

  return (
    <AnimatePresence>
      {isInactive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-black cursor-pointer"
          onClick={handleInteraction}
          onMouseMove={handleInteraction}
          onTouchStart={handleInteraction}
          onKeyDown={handleInteraction}
        >
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={COMMERCIAL_VIDEO_URL}
                className="w-full h-full object-cover"
                loop
                muted={muted}
                playsInline
                onError={handleVideoError}
              />

              {/* Mute/Unmute button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-8 right-8 p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                {muted ? (
                  <VolumeX className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </button>
            </>
          ) : SHOW_FALLBACK_SCREENSAVER ? (
            // Fallback screensaver when no video is available
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-primary mb-4">
                  Dino Residence
                </div>
                <div className="text-xl text-muted-foreground">
                  Touch to explore
                </div>
              </motion.div>

              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/30 rounded-full"
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: window.innerHeight + 50,
                    }}
                    animate={{
                      y: -50,
                      x: Math.random() * window.innerWidth,
                    }}
                    transition={{
                      duration: 8 + Math.random() * 4,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* Touch to continue hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm"
          >
            Touch anywhere to continue
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
