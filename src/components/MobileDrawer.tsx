import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { GlassButton } from "./GlassButton";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Menu, User, Settings, LogOut, Bell, Heart, BookOpen, Users } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface MobileDrawerProps {
  children?: React.ReactNode;
  stats?: {
    totalQuotes: number;
    authors: number;
    favorites: number;
  };
}

export function MobileDrawer({ children, stats }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
      navigate("/");
      setOpen(false);
    } else {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fullName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children || (
          <GlassButton variant="ghost" size="icon" className="glass-interactive">
            <Menu className="h-5 w-5" />
          </GlassButton>
        )}
      </DrawerTrigger>
      
      <DrawerContent className="glass-surface border-glass-border">
        <DrawerHeader className="text-left pb-4">
          <DrawerTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div>{fullName}</div>
              <div className="text-sm text-muted-foreground font-normal">{user?.email}</div>
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4">
          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <GlassCard variant="subtle" className="p-3 text-center">
                <BookOpen className="h-4 w-4 mx-auto mb-1 text-accent" />
                <div className="text-lg font-bold">{stats.totalQuotes}</div>
                <div className="text-xs text-muted-foreground">Quotes</div>
              </GlassCard>
              <GlassCard variant="subtle" className="p-3 text-center">
                <Users className="h-4 w-4 mx-auto mb-1 text-accent" />
                <div className="text-lg font-bold">{stats.authors}</div>
                <div className="text-xs text-muted-foreground">Authors</div>
              </GlassCard>
              <GlassCard variant="subtle" className="p-3 text-center">
                <Heart className="h-4 w-4 mx-auto mb-1 text-accent" />
                <div className="text-lg font-bold">{stats.favorites}</div>
                <div className="text-xs text-muted-foreground">Favorites</div>
              </GlassCard>
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-2">
            <GlassButton
              variant="ghost"
              className="w-full justify-start h-12 text-left"
              onClick={() => {
                navigate("/settings");
                setOpen(false);
              }}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </GlassButton>

            <GlassButton
              variant="ghost"
              className="w-full justify-start h-12 text-left"
              onClick={() => {
                // TODO: Open notifications panel
                setOpen(false);
              }}
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
            </GlassButton>

            <div className="border-t border-glass-border my-4"></div>

            <GlassButton
              variant="ghost"
              className="w-full justify-start h-12 text-left text-red-500 hover:text-red-400"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </GlassButton>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}