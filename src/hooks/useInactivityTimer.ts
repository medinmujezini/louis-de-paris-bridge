import { useState, useEffect, useCallback, useRef } from "react";

interface UseInactivityTimerOptions {
  timeout: number; // in milliseconds
  onInactive?: () => void;
  onActive?: () => void;
}

export const useInactivityTimer = ({
  timeout,
  onInactive,
  onActive,
}: UseInactivityTimerOptions) => {
  const [isInactive, setIsInactive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (isInactive) {
      setIsInactive(false);
      onActive?.();
    }

    timerRef.current = setTimeout(() => {
      setIsInactive(true);
      onInactive?.();
    }, timeout);
  }, [timeout, isInactive, onInactive, onActive]);

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "wheel",
    ];

    // Initial timer start
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  const dismiss = useCallback(() => {
    setIsInactive(false);
    onActive?.();
    resetTimer();
  }, [onActive, resetTimer]);

  return { isInactive, dismiss, resetTimer };
};
