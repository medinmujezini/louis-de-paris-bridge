import { cn } from "@/lib/utils";

interface RoyalDividerProps {
  variant?: "line" | "ornament" | "subtle";
  className?: string;
}

export function RoyalDivider({ variant = "line", className }: RoyalDividerProps) {
  if (variant === "subtle") {
    return (
      <div className={cn("h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent", className)} />
    );
  }

  if (variant === "ornament") {
    return (
      <div className={cn("flex items-center gap-2 py-1", className)}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
        {/* Fleur-de-lis ornament */}
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className="text-primary/50 shrink-0">
          <path
            d="M10 0C10 0 8 3 8 5C8 6.5 9 7 10 7C11 7 12 6.5 12 5C12 3 10 0 10 0Z"
            fill="currentColor"
          />
          <path
            d="M4 4C4 4 6 5.5 7 7C7.5 8 7 9 6 9C5 9 4 8 4 7C4 5.5 4 4 4 4Z"
            fill="currentColor"
          />
          <path
            d="M16 4C16 4 14 5.5 13 7C12.5 8 13 9 14 9C15 9 16 8 16 7C16 5.5 16 4 16 4Z"
            fill="currentColor"
          />
          <path
            d="M10 7V12"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M7 12H13"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="3" cy="10" r="1" fill="currentColor" opacity="0.3" />
          <circle cx="17" cy="10" r="1" fill="currentColor" opacity="0.3" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/30" />
      </div>
    );
  }

  // Default: "line" variant — gold gradient with centered diamond
  return (
    <div className={cn("flex items-center gap-0 mx-2", className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/25" />
      <div className="w-1.5 h-1.5 rotate-45 bg-primary/40 shrink-0" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/25" />
    </div>
  );
}
