import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useThreeDMode } from "@/contexts/ThreeDModeContext";
import { InteriorTransition } from "@/components/interior/InteriorTransition";
import { InteriorUI } from "@/components/interior/InteriorUI";

const InteriorEditPage = () => {
  const { active, phase, setPhase } = useThreeDMode();

  // If user navigates here directly, skip transition and show interior UI
  useEffect(() => {
    if (!active && phase === null) {
      setPhase("interior");
    }
  }, [active, phase, setPhase]);

  return (
    <div className="fixed inset-0 z-50">
      <AnimatePresence>
        {(phase === "loading" || phase === "video" ||
          phase === "exiting-loading" || phase === "exiting-video") && (
          <InteriorTransition />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase === "interior" && <InteriorUI />}
      </AnimatePresence>
    </div>
  );
};

export default InteriorEditPage;
