import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type FontSize = "small" | "medium" | "large" | "xlarge";
export type UIMode = "simple" | "complex";

interface AccessibilitySettings {
  fontSize: FontSize;
  uiMode: UIMode;
  voiceRecognitionEnabled: boolean;
  voiceHelperEnabled: boolean;
  voiceHelperSpeed: number;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setFontSize: (size: FontSize) => void;
  setUIMode: (mode: UIMode) => void;
  setVoiceRecognitionEnabled: (enabled: boolean) => void;
  setVoiceHelperEnabled: (enabled: boolean) => void;
  setVoiceHelperSpeed: (speed: number) => void;
  resetToDefaults: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "medium",
  uiMode: "complex",
  voiceRecognitionEnabled: false,
  voiceHelperEnabled: false,
  voiceHelperSpeed: 1,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = "accessibility-settings";

const fontSizeClasses: Record<FontSize, string> = {
  small: "font-small",
  medium: "font-medium",
  large: "font-large",
  xlarge: "font-xlarge",
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply font size class to html element
  useEffect(() => {
    const html = document.documentElement;
    Object.values(fontSizeClasses).forEach((cls) => html.classList.remove(cls));
    html.classList.add(fontSizeClasses[settings.fontSize]);
  }, [settings.fontSize]);

  // Apply UI mode class to html element
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("ui-simple", "ui-complex");
    html.classList.add(`ui-${settings.uiMode}`);
  }, [settings.uiMode]);

  // Track speaking state
  useEffect(() => {
    const handleEnd = () => setIsSpeaking(false);
    const handleStart = () => setIsSpeaking(true);

    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.addEventListener("start", handleStart);
      speechSynthesis.addEventListener("end", handleEnd);
      
      return () => {
        speechSynthesis.removeEventListener("start", handleStart);
        speechSynthesis.removeEventListener("end", handleEnd);
      };
    }
  }, []);

  const setFontSize = (fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const setUIMode = (uiMode: UIMode) => {
    setSettings((prev) => ({ ...prev, uiMode }));
  };

  const setVoiceRecognitionEnabled = (voiceRecognitionEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, voiceRecognitionEnabled }));
  };

  const setVoiceHelperEnabled = (voiceHelperEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, voiceHelperEnabled }));
  };

  const setVoiceHelperSpeed = (voiceHelperSpeed: number) => {
    setSettings((prev) => ({ ...prev, voiceHelperSpeed }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const speak = (text: string) => {
    if (typeof speechSynthesis === "undefined" || !settings.voiceHelperEnabled) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceHelperSpeed;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof speechSynthesis !== "undefined") {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setFontSize,
        setUIMode,
        setVoiceRecognitionEnabled,
        setVoiceHelperEnabled,
        setVoiceHelperSpeed,
        resetToDefaults,
        speak,
        stopSpeaking,
        isSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
