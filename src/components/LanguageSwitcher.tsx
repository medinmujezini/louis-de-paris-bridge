import { useLanguage, languages, Language } from "@/i18n/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlassButton } from "@/components/ui/glass-button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  const currentLang = languages.find((l) => l.code === language);

  const handleSelect = (langCode: string) => {
    console.log("LanguageSwitcher: selecting", langCode);
    setLanguage(langCode as Language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <GlassButton variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang?.flag}</span>
        </GlassButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="center"
        side="top"
        sideOffset={8}
        className="z-[100] bg-card/95 backdrop-blur-xl border-border/50"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => handleSelect(lang.code)}
            className={`gap-2 cursor-pointer ${
              language === lang.code ? "bg-primary/20 text-primary" : ""
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
