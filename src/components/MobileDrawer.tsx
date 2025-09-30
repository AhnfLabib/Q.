import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { GlassButton } from "./GlassButton";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { User, Settings, LogOut } from "lucide-react";

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
            <User className="h-5 w-5" />
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