import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl bg-[hsl(220,20%,10%,0.45)] backdrop-blur-xl border border-white/[0.18] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-white/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
GlassInput.displayName = "GlassInput";

export { GlassInput };
