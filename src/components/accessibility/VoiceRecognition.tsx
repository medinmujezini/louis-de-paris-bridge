import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Switch } from "@/components/ui/switch";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export function VoiceRecognition() {
  const { voiceRecognitionEnabled, setVoiceRecognitionEnabled } = useAccessibility();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const processCommand = useCallback(
    (transcript: string) => {
      const lowerTranscript = transcript.toLowerCase().trim();

      // Navigation commands
      const commands: Record<string, () => void> = {
        // English
        "go home": () => navigate("/"),
        "go to home": () => navigate("/"),
        "home": () => navigate("/"),
        "go to units": () => navigate("/units"),
        "show units": () => navigate("/units"),
        "units": () => navigate("/units"),
        "go to surroundings": () => navigate("/surroundings"),
        "surroundings": () => navigate("/surroundings"),
        "scroll down": () => window.scrollBy({ top: 300, behavior: "smooth" }),
        "scroll up": () => window.scrollBy({ top: -300, behavior: "smooth" }),
        
        // Albanian
        "shko në shtëpi": () => navigate("/"),
        "shtëpi": () => navigate("/"),
        "shko te njësitë": () => navigate("/units"),
        "njësitë": () => navigate("/units"),
        "rrethina": () => navigate("/surroundings"),
        
        // French
        "aller à l'accueil": () => navigate("/"),
        "accueil": () => navigate("/"),
        "aller aux unités": () => navigate("/units"),
        "unités": () => navigate("/units"),
        "environs": () => navigate("/surroundings"),
        
        // German
        "gehe nach hause": () => navigate("/"),
        "startseite": () => navigate("/"),
        "gehe zu einheiten": () => navigate("/units"),
        "einheiten": () => navigate("/units"),
        "umgebung": () => navigate("/surroundings"),
      };

      // Find matching command
      for (const [command, action] of Object.entries(commands)) {
        if (lowerTranscript.includes(command)) {
          action();
          toast({
            title: t.accessibility.voice.commandRecognized,
            description: transcript,
          });
          return true;
        }
      }

      return false;
    },
    [navigate, t]
  );

  // Initialize speech recognition
  useEffect(() => {
    if (!voiceRecognitionEnabled || !isSupported) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    
    // Set language based on current app language
    const langMap: Record<string, string> = {
      en: "en-US",
      sq: "sq-AL",
      fr: "fr-FR",
      de: "de-DE",
    };
    recognition.lang = langMap[language] || "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Restart if still enabled
      if (voiceRecognitionEnabled) {
        try {
          recognition.start();
        } catch (e) {
          // Already started
        }
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      processCommand(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
    }

    return () => {
      recognition.stop();
    };
  }, [voiceRecognitionEnabled, isSupported, language, processCommand]);

  if (!isSupported) {
    return (
      <div className="space-y-3 opacity-50">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <MicOff className="w-4 h-4" />
          {t.accessibility.voice.recognition}
        </h4>
        <p className="text-xs text-muted-foreground">
          {t.accessibility.voice.notSupported}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            {isListening ? (
              <Mic className="w-4 h-4 text-primary animate-pulse" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            {t.accessibility.voice.recognition}
          </h4>
          <p className="text-xs text-muted-foreground">
            {isListening
              ? t.accessibility.voice.listening
              : t.accessibility.voice.recognitionDesc}
          </p>
        </div>
        <Switch
          checked={voiceRecognitionEnabled}
          onCheckedChange={setVoiceRecognitionEnabled}
        />
      </div>

      {voiceRecognitionEnabled && (
        <div className="text-xs text-muted-foreground pl-2 border-l-2 border-primary/20 space-y-1">
          <p className="font-medium text-foreground">
            {t.accessibility.voice.commands}:
          </p>
          <ul className="space-y-0.5">
            <li>"Go home" / "Go to units" / "Surroundings"</li>
            <li>"Scroll up" / "Scroll down"</li>
          </ul>
        </div>
      )}
    </div>
  );
}
