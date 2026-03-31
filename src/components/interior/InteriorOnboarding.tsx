import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  X, ChevronRight, Mouse, Settings, Printer, MessageSquareQuote,
} from "lucide-react";

type Phase = "wasd" | "mouse" | "buttons" | "complete";

const INTERIOR_ONBOARDING_KEY = "dino_interior_onboarding_complete";

export function InteriorOnboarding() {
  const [phase, setPhase] = useState<Phase>(() => {
    // TODO: remove this bypass after testing — always show onboarding on reload
    // if (localStorage.getItem(INTERIOR_ONBOARDING_KEY) === "true") return "complete";
    return "wasd";
  });
  const [fading, setFading] = useState(false);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(INTERIOR_ONBOARDING_KEY, "true");
    setFading(true);
    setTimeout(() => setPhase("complete"), 500);
  }, []);

  const transitionTo = useCallback((next: Phase) => {
    setFading(true);
    setTimeout(() => {
      setPhase(next);
      setFading(false);
    }, 400);
  }, []);

  const skip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  if (phase === "complete") return null;

  const phaseIndex = phase === "wasd" ? 0 : phase === "mouse" ? 1 : 2;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[300] transition-opacity duration-500 pointer-events-auto",
        fading ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Skip button */}
      <button
        onClick={skip}
        className="absolute top-5 right-5 z-[310] flex items-center gap-2 px-4 py-2 rounded-full
                   bg-white/10 backdrop-blur-md border border-white/20
                   text-sm text-white/70 hover:text-white hover:bg-white/20
                   transition-all duration-200"
      >
        <X className="w-4 h-4" />
        Skip
      </button>

      {/* Phase 1: WASD Movement */}
      <AnimatePresence mode="wait">
        {phase === "wasd" && (
          <motion.div
            key="wasd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {/* WASD Keys Visual */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex justify-center">
                  <KeyCap letter="W" />
                </div>
                <div className="flex gap-2">
                  <KeyCap letter="A" />
                  <KeyCap letter="S" />
                  <KeyCap letter="D" />
                </div>
              </div>

              <div className="glass-card glass-card--strong px-8 py-4 text-center relative max-w-sm">
                <div className="glass-card__light-bar glass-card__light-bar--strong" />
                <p className="text-lg font-semibold text-foreground">
                  Use WASD to Move
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Walk forward, backward, and strafe through the interior
                </p>
                <button
                  onClick={() => transitionTo("mouse")}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                             bg-primary hover:bg-primary/90
                             text-sm font-semibold text-primary-foreground transition-colors
                             shadow-lg shadow-primary/30"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
                <ProgressDots current={0} total={3} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Mouse Look */}
        {phase === "mouse" && (
          <motion.div
            key="mouse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
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
                  Move Mouse to Look Around
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Move your mouse to rotate the camera and explore the space
                </p>
                <button
                  onClick={() => transitionTo("buttons")}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                             bg-primary hover:bg-primary/90
                             text-sm font-semibold text-primary-foreground transition-colors
                             shadow-lg shadow-primary/30"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
                <ProgressDots current={1} total={3} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 3: Action Buttons */}
        {phase === "buttons" && (
          <motion.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {/* Button preview */}
              <div className="flex flex-col gap-3 items-center">
                <ButtonPreview icon={<Settings className="w-5 h-5" />} label="Edit Interior" desc="Customize materials and finishes" />
                <ButtonPreview icon={<Printer className="w-5 h-5" />} label="Print Plan" desc="Download a printable brochure" />
                <ButtonPreview icon={<MessageSquareQuote className="w-5 h-5" />} label="Ask for Quote" desc="Send an inquiry about this unit" />
              </div>

              <div className="glass-card glass-card--strong px-8 py-4 text-center relative max-w-sm">
                <div className="glass-card__light-bar glass-card__light-bar--strong" />
                <p className="text-lg font-semibold text-foreground">
                  Use the Action Buttons
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Find these tools on the right side panel to interact with the unit
                </p>
                <button
                  onClick={completeOnboarding}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg
                             bg-primary hover:bg-primary/90
                             text-sm font-semibold text-primary-foreground transition-colors
                             shadow-lg shadow-primary/30"
                >
                  Got it!
                  <ChevronRight className="w-4 h-4" />
                </button>
                <ProgressDots current={2} total={3} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-components ── */

function KeyCap({ letter }: { letter: string }) {
  return (
    <div className="w-14 h-14 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-sm
                    flex items-center justify-center text-xl font-bold text-white
                    shadow-[0_4px_0_0_rgba(255,255,255,0.15)] animate-[pulse_2s_ease-in-out_infinite]">
      {letter}
    </div>
  );
}

function ButtonPreview({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 min-w-[280px]">
      <div className="text-primary">{icon}</div>
      <div className="text-left">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex justify-center gap-3 mt-3">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            i === current ? "bg-primary" : i < current ? "bg-primary/40" : "bg-white/20"
          )}
        />
      ))}
    </div>
  );
}
