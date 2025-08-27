import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, Mail, Layout, BookOpen, Heart, Search } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen animate-page-enter">
      {/* Simple Landing Header */}
      <header className="sticky top-0 z-50 w-full animate-slide-down">
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
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-glass bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text animate-slide-up animate-float">
              Welcome to Q<span className="text-accent">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Store your favorite quotes in stunning visual galleries and wake up to daily inspiration in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
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
        <section className="px-4 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get daily inspiration delivered to your inbox
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Store your quotes in stunning visual layouts and receive curated inspiration delivered to your inbox every morning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((feature, index) => (
              <GlassCard key={index} variant="subtle" className="p-6 text-center group hover-lift">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
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
          <GlassCard variant="strong" className="max-w-2xl mx-auto p-8 animate-scale-in hover-glow animate-pulse-glow">
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
  );
};

export default Landing;