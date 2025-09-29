import { Home, Search, Plus, Settings, User } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'search' | 'add' | 'settings';
  onTabChange: (tab: 'dashboard' | 'search' | 'add' | 'settings') => void;
  className?: string;
}

export function MobileBottomNav({ activeTab, onTabChange, className }: MobileBottomNavProps) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 md:hidden", className)}>
      <GlassCard variant="strong" className="mx-3 mb-3 px-2 py-3 rounded-3xl shadow-lg">
        <div className="flex items-center justify-around">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-3 py-2 rounded-2xl transition-all duration-200",
                activeTab === id
                  ? "bg-accent/20 text-accent scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
              )}
              aria-label={label}
            >
              <Icon className={cn("h-5 w-5 mb-1", id === 'add' && activeTab === id && "scale-110")} />
              <span className={cn(
                "text-xs font-medium transition-all",
                activeTab === id ? "opacity-100" : "opacity-60"
              )}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}