import { BuildingSection } from "@/data/building-sections";
import { cn } from "@/lib/utils";
import { GlassButton } from "@/components/ui/glass-button";
import { Layers } from "lucide-react";

interface SectionTabsProps {
  sections: BuildingSection[];
  activeSection: string | null;
  onSectionChange: (sectionId: string | null) => void;
  allLabel?: string;
}

export function SectionTabs({
  sections,
  activeSection,
  onSectionChange,
  allLabel = "All",
}: SectionTabsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      <GlassButton
        variant={activeSection === null ? "default" : "ghost"}
        size="sm"
        onClick={() => onSectionChange(null)}
        className={cn(
          "whitespace-nowrap text-xs",
          activeSection === null && "ring-1 ring-primary/50"
        )}
      >
        <Layers className="w-3 h-3 mr-1" />
        {allLabel}
      </GlassButton>
      
      {sections.map((section) => (
        <GlassButton
          key={section.id}
          variant={activeSection === section.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onSectionChange(section.id)}
          className={cn(
            "whitespace-nowrap text-xs",
            activeSection === section.id && "ring-1 ring-primary/50"
          )}
        >
          {section.name}
        </GlassButton>
      ))}
    </div>
  );
}
