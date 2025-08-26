import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle" | "accent";
  interactive?: boolean;
  refraction?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", interactive = false, refraction = false, children, ...props }, ref) => {
    const baseClasses = "relative rounded-2xl";
    
    const variantClasses = {
      default: "glass-surface",
      strong: "glass-surface-strong", 
      subtle: "glass-surface-subtle",
      accent: "glass-accent"
    };
    
    const interactiveClasses = interactive ? "glass-interactive" : "";
    const refractionClasses = refraction ? "glass-refraction" : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          interactiveClasses,
          refractionClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };