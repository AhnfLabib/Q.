import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const glassButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default: "glass-surface glass-interactive text-foreground hover:text-foreground",
        accent: "glass-accent text-accent-red hover:text-accent-red font-semibold",
        solid: "bg-foreground text-background hover:bg-foreground/90",
        ghost: "hover:bg-foreground/5 text-foreground",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        icon: "h-12 w-12",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  refraction?: boolean;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, refraction = true, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          glassButtonVariants({ variant, size }),
          refraction && "glass-refraction",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };