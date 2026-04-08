import { Building2, TreePine } from "lucide-react";
import { useAppFlow } from "@/contexts/AppFlowContext";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { cn } from "@/lib/utils";

const sections = [
  {
    id: "apartment" as const,
    title: "Residential Apartments",
    description: "Modern luxury apartments with stunning views and premium finishes",
    icon: Building2,
  },
  {
    id: "villa" as const,
    title: "Luxury Villas",
    description: "Exclusive private villas with gardens and spacious living areas",
    icon: TreePine,
  },
];

export function SectionSelector() {
  const { selectSection } = useAppFlow();

  const handleSelect = (section: "apartment" | "villa") => {
    sendToUnreal(UEEvents.FOCUS_SECTION, { section });
    selectSection(section);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Language selector top-right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 text-center space-y-10">
        <div className="space-y-2">
          <svg width="32" height="22" viewBox="0 0 20 14" fill="none" className="text-primary mx-auto">
            <path d="M10 0C10 0 8 3 8 5C8 6.5 9 7 10 7C11 7 12 6.5 12 5C12 3 10 0 10 0Z" fill="currentColor" />
            <path d="M4 4C4 4 6 5.5 7 7C7.5 8 7 9 6 9C5 9 4 8 4 7C4 5.5 4 4 4 4Z" fill="currentColor" />
            <path d="M16 4C16 4 14 5.5 13 7C12.5 8 13 9 14 9C15 9 16 8 16 7C16 5.5 16 4 16 4Z" fill="currentColor" />
            <path d="M10 7V12" stroke="currentColor" strokeWidth="1.2" />
            <path d="M7 12H13" stroke="currentColor" strokeWidth="1" />
          </svg>
          <h1 className="text-5xl font-bold tracking-tight royal-text drop-shadow-lg font-display">
            Louis de Paris
          </h1>
          <p className="text-muted-foreground mt-3 text-lg tracking-wide">
            Select a property type to explore
          </p>
        </div>

        <RoyalDivider variant="ornament" className="max-w-md mx-auto" />

        <div className="flex gap-8">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className={cn(
                  "group relative w-80 rounded-2xl text-left transition-all duration-300 overflow-hidden royal-corner royal-glow",
                  "bg-black/60 backdrop-blur-xl border border-white/20",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]",
                  "hover:scale-[1.03] hover:border-primary/40 hover:shadow-[0_0_40px_hsl(43,50%,54%,0.2)]"
                )}
              >
                {/* Top gold accent bar */}
                <div className="absolute top-0 left-[20%] w-[60%] h-[2px] bg-primary/60 group-hover:bg-primary transition-colors" />
                {/* Downward glow from gold strip on hover */}
                <div className="absolute top-0 left-[10%] w-[80%] h-0 group-hover:h-32 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent blur-xl transition-all duration-500 pointer-events-none" />

                <div className="p-8 space-y-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <div className="text-xs text-primary font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                    Explore →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
