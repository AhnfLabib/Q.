import { Home, Search, Plus, Settings, User } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";
interface MobileBottomNavProps {
  activeTab: 'dashboard' | 'search' | 'add' | 'settings';
  onTabChange: (tab: 'dashboard' | 'search' | 'add' | 'settings') => void;
  className?: string;
}
export function MobileBottomNav({
  activeTab,
  onTabChange,
  className
}: MobileBottomNavProps) {
  const tabs = [{
    id: 'dashboard',
    label: 'Home',
    icon: Home
  }, {
    id: 'search',
    label: 'Search',
    icon: Search
  }, {
    id: 'add',
    label: 'Add',
    icon: Plus
  }, {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }] as const;
  return <div className={cn("fixed bottom-0 left-0 right-0 z-50 md:hidden", className)}>
      
    </div>;
}