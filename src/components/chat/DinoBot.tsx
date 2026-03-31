import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, Mic, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { defaultFilters } from "@/types/units";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dinobot-chat`;

const GREETING = "Mirë se vini! 👋 Unë jam DinoBot, asistenti juaj virtual i Dino Residence. Si mund t'ju ndihmoj sot?";

const ACTION_REGEX = /:::ACTION(\{.*?\}):::/gs;

function stripActions(text: string): string {
  return text.replace(ACTION_REGEX, "").trim();
}

function extractActions(text: string): Array<{ type: string; filters?: Record<string, unknown> }> {
  const actions: Array<{ type: string; filters?: Record<string, unknown> }> = [];
  let match;
  const re = /:::ACTION(\{.*?\}):::/gs;
  while ((match = re.exec(text)) !== null) {
    try {
      actions.push(JSON.parse(match[1]));
    } catch { /* skip malformed */ }
  }
  return actions;
}

interface DinoBotProps {
  open: boolean;
  onClose: () => void;
}

export function DinoBot({ open, onClose }: DinoBotProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "sq-AL";
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-send after voice input
      setTimeout(() => {
        const form = document.getElementById("dinobot-form");
        if (form) form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      }, 100);
    };

    try {
      recognition.start();
    } catch { /* already started */ }
  }, [isListening]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const executeActions = useCallback((fullText: string) => {
    const actions = extractActions(fullText);
    for (const action of actions) {
      if (action.type === "filter_units" && action.filters) {
        navigate("/units");
        // Small delay to let the page mount before dispatching
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("dinobot-filter", { detail: action.filters })
          );
        }, 100);
      }
    }
  }, [navigate]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      // Display version strips action blocks
      const displayContent = stripActions(assistantSoFar);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > newMessages.length) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: displayContent } : m
          );
        }
        return [...prev, { role: "assistant", content: displayContent }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to connect");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Execute any actions from the complete response
      executeActions(assistantSoFar);
    } catch (e) {
      console.error("DinoBot error:", e);
      upsertAssistant("Na vjen keq, ndodhi një gabim. Provoni përsëri!");
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, executeActions]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 left-24 z-50 w-80 h-[28rem] flex flex-col rounded-2xl overflow-hidden glass-card glass-card--strong">
      {/* Top light bar */}
      <div className="glass-card__light-bar glass-card__light-bar--strong" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--primary) / 0.25)" }}
          >
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">DinoBot</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
              msg.role === "user"
                ? "ml-auto bg-primary/20 text-foreground border border-primary/20"
                : "mr-auto text-foreground/90"
            )}
            style={
              msg.role === "assistant"
                ? {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
                : undefined
            }
          >
            {msg.role === "assistant" ? (
              <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              msg.content
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div
            className="mr-auto max-w-[85%] rounded-2xl px-3 py-2 text-sm"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-border/20">
        <form
          id="dinobot-form"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Shkruani ose flisni…"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={toggleVoice}
            disabled={isLoading}
            className={cn(
              "p-2 rounded-xl transition-all",
              isListening ? "bg-primary/30 border border-primary/50" : ""
            )}
            style={!isListening ? {
              background: "hsl(var(--primary) / 0.15)",
              border: "1px solid hsl(var(--primary) / 0.2)",
            } : undefined}
            title="Voice input"
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-primary animate-pulse" />
            ) : (
              <Mic className="w-4 h-4 text-primary" />
            )}
          </button>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-xl transition-all disabled:opacity-30"
            style={{
              background: "hsl(var(--primary) / 0.2)",
              border: "1px solid hsl(var(--primary) / 0.3)",
            }}
          >
            <Send className="w-4 h-4 text-primary" />
          </button>
        </form>
      </div>
    </div>
  );
}
