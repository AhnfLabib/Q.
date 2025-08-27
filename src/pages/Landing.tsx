import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, Mail, Layout, BookOpen, Heart, Search } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState<'splash' | 'transition' | 'complete'>('splash');

  useEffect(() => {
    // Phase 1: Show splash for 1 second
    const splashTimer = setTimeout(() => {
      setAnimationPhase('transition');
    }, 1000);

    // Phase 2: Complete transition after animation duration
    const transitionTimer = setTimeout(() => {
      setAnimationPhase('complete');
    }, 1800);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  const features = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Visual Quote Gallery",
      description: "Transform your quotes into a stunning visual collection that's as beautiful as it is meaningful"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Daily Inspiration Delivered",
      description: "Wake up to carefully curated quotes in your inbox every morning to start your day with inspiration"
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Smart Visual Organization",
      description: "See your quotes arranged in beautiful, intuitive layouts that make browsing and rediscovering a joy"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Collect from Anywhere",
      description: "Capture meaningful quotes from books, articles, conversations, and social media in seconds"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Personal Favorites",
      description: "Build your personal collection of the quotes that move you most, beautifully displayed"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Instant Quote Discovery",
      description: "Find that perfect quote you remembered in seconds with intelligent search"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Splash Screen */}
      {animationPhase === 'splash' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center glass-surface-subtle">
          <div className="text-9xl md:text-[12rem] lg:text-[16rem] font-bold text-foreground animate-scale-in">
            Q<span className="text-accent">.</span>
          </div>
        </div>
      )}

      {/* Transitioning Q */}
      {animationPhase === 'transition' && (
        <div className="fixed inset-0 z-[99] pointer-events-none">
          <div 
            className="absolute text-9xl md:text-[12rem] lg:text-[16rem] font-bold text-foreground transition-all duration-700 ease-out"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${animationPhase === 'transition' ? '0.4' : '1'})`,
              animation: 'morphToHero 0.8s ease-out forwards'
            }}
          >
            Q<span className="text-accent">.</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${
        animationPhase === 'splash' ? 'opacity-0' : 
        animationPhase === 'transition' ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* Simple Landing Header */}
        <header className="sticky top-0 z-50 w-full">
          <div className="mx-4 mt-4 mb-6 px-6 py-4 glass-surface-subtle rounded-2xl shadow-none">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Q<span className="text-accent text-4xl">.</span>
              </h1>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <GlassButton
                  variant="ghost"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </GlassButton>
                <GlassButton
                  variant="accent"
                  onClick={() => navigate('/auth?mode=signup')}
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
              <h1 className={`text-6xl md:text-8xl font-bold mb-6 text-glass bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text transition-all duration-500 ${
                animationPhase === 'complete' ? 'animate-fade-in' : ''
              }`}>
                <span className={animationPhase === 'transition' ? 'opacity-0' : 'opacity-100 transition-opacity delay-300 duration-500'}>
                  Welcome to{' '}
                </span>
                <span className={animationPhase === 'transition' ? 'opacity-0' : 'opacity-100 transition-opacity delay-500 duration-500'}>
                  Q<span className="text-accent">.</span>
                </span>
              </h1>
              <p className={`text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto transition-all duration-500 delay-700 ${
                animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                Turn scattered wisdom into visual stories. Wake up inspired every morning.
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 delay-900 ${
                animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <GlassButton 
                  variant="accent" 
                  size="lg"
                  onClick={() => navigate('/auth?mode=signup')}
                  className="text-lg px-8 py-4"
                >
                  Start Your Library
                </GlassButton>
                <GlassButton 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-4"
                >
                  Sign In
                </GlassButton>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className={`px-4 py-16 max-w-6xl mx-auto transition-all duration-500 delay-1000 ${
            animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get daily inspiration delivered to your inbox
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Store your quotes in stunning visual layouts and receive curated inspiration delivered to your inbox every morning.
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
          <section className={`px-4 py-16 text-center transition-all duration-500 delay-1200 ${
            animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <GlassCard variant="strong" className="max-w-2xl mx-auto p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to start collecting?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of readers who use Q. to build their personal quote libraries.
              </p>
              <GlassButton 
                variant="accent" 
                size="lg"
                onClick={() => navigate('/auth?mode=signup')}
                className="text-lg px-8 py-4"
              >
                Get Started Free
              </GlassButton>
            </GlassCard>
          </section>
        </main>
      </div>

    </div>
  );
};

export default Landing;