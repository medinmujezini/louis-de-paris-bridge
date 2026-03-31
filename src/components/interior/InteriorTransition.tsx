import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useThreeDMode } from "@/contexts/ThreeDModeContext";
import { registerHandler, sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { Progress } from "@/components/ui/progress";
import { GlassButton } from "@/components/ui/glass-button";
import { SkipForward } from "lucide-react";
import dinoLogo from "@/assets/dino-residence-logo.png";

export function InteriorTransition() {
  const { unit, phase, setPhase, finalizeExit } = useThreeDMode();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitVideoRef = useRef<HTMLVideoElement>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const progressTimerRef = useRef<ReturnType<typeof setInterval>>();

  // ── ENTER: loading phase ──
  useEffect(() => {
    if (phase !== "loading") return;

    if (unit) {
      sendToUnreal(UEEvents.ENTER_INTERIOR, { id: unit.id });
    }

    setProgress(0);
    setFadingOut(false);
    let current = 0;
    progressTimerRef.current = setInterval(() => {
      current += Math.random() * 8 + 2;
      if (current > 90) current = 90;
      setProgress(current);
    }, 200);

    const advanceToVideo = () => {
      setProgress(100);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setTimeout(() => setPhase("video"), 400);
    };

    const unsubscribe = registerHandler(UEEvents.INTERIOR_READY, advanceToVideo);

    const safetyTimeout = setTimeout(() => {
      console.warn("[InteriorTransition] interiorReady timeout — advancing automatically");
      advanceToVideo();
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(safetyTimeout);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [phase, unit, setPhase]);

  // ── ENTER: video phase ──
  useEffect(() => {
    if (phase !== "video") return;

    setShowSkip(false);
    setFadingOut(false);

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        setTimeout(() => handleEnterSkip(), 3000);
      });
    } else {
      setTimeout(() => handleEnterSkip(), 3000);
    }

    skipTimerRef.current = setTimeout(() => setShowSkip(true), 2000);

    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    };
  }, [phase]);

  const handleEnterSkip = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => setPhase("interior"), 600);
  };

  // ── EXIT: loading phase ──
  useEffect(() => {
    if (phase !== "exiting-loading") return;

    setProgress(0);
    setFadingOut(false);
    setShowSkip(false);
    let current = 0;
    progressTimerRef.current = setInterval(() => {
      current += Math.random() * 12 + 4;
      if (current > 90) current = 90;
      setProgress(current);
    }, 150);

    // Faster exit — auto-advance after 3s
    const advanceTimeout = setTimeout(() => {
      setProgress(100);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setTimeout(() => setPhase("exiting-video"), 400);
    }, 3000);

    return () => {
      clearTimeout(advanceTimeout);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [phase, setPhase]);

  // ── EXIT: video phase ──
  useEffect(() => {
    if (phase !== "exiting-video") return;

    setShowSkip(false);
    setFadingOut(false);

    const video = exitVideoRef.current;
    if (video) {
      video.play().catch(() => {
        setTimeout(() => handleExitSkip(), 3000);
      });
    } else {
      setTimeout(() => handleExitSkip(), 3000);
    }

    skipTimerRef.current = setTimeout(() => setShowSkip(true), 2000);

    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    };
  }, [phase]);

  const handleExitSkip = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      finalizeExit();
      navigate("/units");
    }, 600);
  };

  if (!unit) return null;

  const isEntering = phase === "loading" || phase === "video";
  const isExiting = phase === "exiting-loading" || phase === "exiting-video";

  return (
    <AnimatePresence mode="wait">
      {/* ── ENTER LOADING ── */}
      {phase === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center"
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

          <motion.img
            src={dinoLogo}
            alt="Dino Residence"
            className="w-48 mb-8"
            initial={{ opacity: 0.4, scale: 0.95 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          <div className="w-64 space-y-3">
            <Progress value={progress} className="h-1.5 bg-white/10" />
            <p className="text-sm text-muted-foreground text-center animate-pulse">
              Preparing your interior view…
            </p>
          </div>
        </motion.div>
      )}

      {/* ── ENTER VIDEO ── */}
      {phase === "video" && (
        <motion.div
          key="video"
          initial={{ opacity: 0 }}
          animate={{ opacity: fadingOut ? 0 : 1 }}
          transition={{ duration: fadingOut ? 0.6 : 0.5 }}
          className="fixed inset-0 z-[60] bg-black"
        >
          <video
            ref={videoRef}
            src="/videos/interior-transition.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            onEnded={handleEnterSkip}
            onError={() => setTimeout(() => handleEnterSkip(), 3000)}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.img
              src={dinoLogo}
              alt=""
              className="w-40 opacity-60"
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <AnimatePresence>
            {showSkip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 right-8"
              >
                <GlassButton variant="secondary" onClick={handleEnterSkip}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </GlassButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── EXIT LOADING ── */}
      {phase === "exiting-loading" && (
        <motion.div
          key="exit-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center"
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

          <motion.img
            src={dinoLogo}
            alt="Dino Residence"
            className="w-48 mb-8"
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0.8, scale: 0.95 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          <div className="w-64 space-y-3">
            <Progress value={progress} className="h-1.5 bg-white/10" />
            <p className="text-sm text-muted-foreground text-center animate-pulse">
              Returning to exterior…
            </p>
          </div>
        </motion.div>
      )}

      {/* ── EXIT VIDEO ── */}
      {phase === "exiting-video" && (
        <motion.div
          key="exit-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: fadingOut ? 0 : 1 }}
          transition={{ duration: fadingOut ? 0.6 : 0.5 }}
          className="fixed inset-0 z-[60] bg-black"
        >
          <video
            ref={exitVideoRef}
            src="/videos/exit-transition.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            onEnded={handleExitSkip}
            onError={() => setTimeout(() => handleExitSkip(), 3000)}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.img
              src={dinoLogo}
              alt=""
              className="w-40 opacity-60"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <AnimatePresence>
            {showSkip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-8 right-8"
              >
                <GlassButton variant="secondary" onClick={handleExitSkip}>
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </GlassButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
