import { Building2, TreePine } from "lucide-react";
import { useAppFlow } from "@/contexts/AppFlowContext";
import { sendToUnreal, UEEvents } from "@/lib/ue-bridge";
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
      <div className="text-center space-y-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Louis de Paris
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Select a property type to explore
          </p>
        </div>

        <div className="flex gap-8">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className={cn(
                  "glass-card glass-card--strong group relative w-72 p-8 text-left transition-all duration-300",
                  "hover:scale-[1.03] hover:shadow-[0_0_40px_hsl(43,50%,54%,0.15)]"
                )}
              >
                <div className="glass-card__light-bar glass-card__light-bar--strong" />
                <div className="relative z-10 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <div className="text-xs text-primary font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity">
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
