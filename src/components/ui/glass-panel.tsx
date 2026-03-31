import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sidebar" | "modal";
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-[hsl(220,20%,10%,0.45)] backdrop-blur-xl border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-xl",
      sidebar: "glass-panel-layered rounded-xl",
      modal: "bg-[hsl(220,20%,10%,0.6)] backdrop-blur-2xl border border-white/[0.22] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] rounded-2xl",
    };

    const isLayered = variant === "sidebar";

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300",
          variants[variant],
          className
        )}
        {...props}
      >
        {isLayered && (
          <div className="glass-panel__light-bar" aria-hidden="true" />
        )}
        {isLayered ? (
          <div className="relative z-10 h-full">{children}</div>
        ) : (
          children
        )}
      </div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
