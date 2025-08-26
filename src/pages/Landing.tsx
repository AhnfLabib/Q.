import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Users, BookOpen, Heart, Zap, Shield, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [showAuthForm, setShowAuthForm] = useState(false);

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Collect Quotes",
      description: "Save meaningful quotes from books, articles, and conversations"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Organize by Author",
      description: "Browse and filter your collection by favorite authors"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Mark Favorites",
      description: "Keep track of the quotes that resonate most with you"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Quick Search",
      description: "Find any quote instantly with our powerful search"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Private & Secure",
      description: "Your personal library is completely private and secure"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Beautiful Design",
      description: "Enjoy a clean, minimal interface that lets quotes shine"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Simple Landing Header */}
      <header className="sticky top-0 z-50 w-full">
        <div className="mx-4 mt-4 mb-6 px-6 py-4 glass-surface-strong rounded-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Q<span className="text-accent text-4xl">.</span>
            </h1>
            <div className="flex items-center space-x-3">
              <GlassButton
                variant="ghost"
                onClick={() => setShowAuthForm(true)}
              >
                Sign In
              </GlassButton>
              <GlassButton
                variant="accent"
                onClick={() => navigate('/dashboard')}
              >
                Get Started
              </GlassButton>
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative px-4 pt-8 pb-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-glass bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
              Welcome to Q<span className="text-accent">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your personal library for collecting, organizing, and rediscovering the quotes that inspire you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton 
                variant="accent" 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="text-lg px-8 py-4"
              >
                Start Your Library
              </GlassButton>
              <GlassButton 
                variant="ghost" 
                size="lg"
                onClick={() => setShowAuthForm(true)}
                className="text-lg px-8 py-4"
              >
                Sign In
              </GlassButton>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to build your quote library
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Q. provides all the tools you need to collect, organize, and enjoy your favorite quotes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <GlassCard key={index} variant="subtle" className="p-6 text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 text-center">
          <GlassCard variant="strong" className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to start collecting?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Join thousands of readers who use Q. to build their personal quote libraries.
            </p>
            <GlassButton 
              variant="accent" 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8 py-4"
            >
              Get Started Free
            </GlassButton>
          </GlassCard>
        </section>
      </main>

      {showAuthForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <GlassCard variant="strong" className="w-full max-w-md p-6">
            <h3 className="text-2xl font-bold mb-4 text-center">Sign In to Q.</h3>
            <p className="text-center text-muted-foreground mb-6">
              Authentication will be integrated with Supabase soon.
            </p>
            <div className="flex gap-3">
              <GlassButton 
                variant="ghost" 
                onClick={() => setShowAuthForm(false)}
                className="flex-1"
              >
                Close
              </GlassButton>
              <GlassButton 
                variant="accent"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Continue to Demo
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Landing;