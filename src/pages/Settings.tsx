import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Mail, Lock, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: displayName }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: email
      });

      if (error) throw error;

      toast({
        title: "Email update initiated",
        description: "Check your email to confirm the change.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 w-full">
        <GlassCard variant="strong" className="mx-4 mt-4 mb-6 px-6 py-4">
          <div className="flex items-center space-x-4">
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="glass-interactive"
            >
              <ArrowLeft className="h-4 w-4" />
            </GlassButton>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </GlassCard>
      </div>

      <main className="pt-20 px-4 max-w-2xl mx-auto pb-12">
        {/* Profile Settings */}
        <GlassCard className="mb-8 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 glass-surface border-glass-border bg-transparent"
                placeholder="Your name"
              />
            </div>
            
            <GlassButton 
              type="submit" 
              variant="accent" 
              disabled={loading}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Update Profile
            </GlassButton>
          </form>
        </GlassCard>

        {/* Email Settings */}
        <GlassCard className="mb-8 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">Email Address</h2>
          </div>
          
          <form onSubmit={updateEmail} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 glass-surface border-glass-border bg-transparent"
                placeholder="your@email.com"
              />
            </div>
            
            <GlassButton 
              type="submit" 
              variant="accent" 
              disabled={loading}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Update Email
            </GlassButton>
          </form>
        </GlassCard>

        {/* Password Settings */}
        <GlassCard className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>
          
          <form onSubmit={updatePassword} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 glass-surface border-glass-border bg-transparent"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 glass-surface border-glass-border bg-transparent"
                placeholder="Confirm new password"
              />
            </div>
            
            <GlassButton 
              type="submit" 
              variant="accent" 
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Update Password
            </GlassButton>
          </form>
        </GlassCard>
      </main>
    </div>
  );
};

export default Settings;