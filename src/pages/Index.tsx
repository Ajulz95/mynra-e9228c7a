import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MynraLogo } from "@/components/MynraLogo";
import { SplashScreen } from "@/components/SplashScreen";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!loading && user && !showSplash) {
      navigate('/home');
    }
  }, [user, loading, navigate, showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} duration={4000} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset animate-fade-in">
      {/* Status Bar Spacer */}
      <div className="h-safe-top bg-background" />
      
      {/* Header - Mobile App Style */}
      <header className="px-5 py-3 flex items-center justify-center relative">
        <div className="flex items-center gap-2">
          <MynraLogo size="md" />
          <span className="text-2xl font-bold text-primary tracking-tight">Mynra</span>
        </div>
      </header>

      {/* Hero Section - Optimized for Mobile */}
      <main className="flex-1 flex flex-col justify-center items-center px-5 pb-6">
        <div className="w-full space-y-6 flex flex-col items-center mt-4">
          {/* Illustration - Calming visual with gentle float animation */}
          <div className="relative mx-auto w-40 h-40 animate-float">
            <div className="absolute inset-0 bg-secondary/20 rounded-full animate-breathe" />
            <div className="absolute inset-3 bg-secondary/30 rounded-full" />
            <div className="absolute inset-6 bg-secondary/50 rounded-full flex items-center justify-center">
              <Users className="w-14 h-14 text-primary" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-primary leading-tight">
              You're Not Alone in This
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed px-2">
              Connect with peers who understand. Share your journey in a safe, 
              supportive space where healing happens together.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-5 py-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-secondary" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-accent" />
              <span>Peer Support</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Section - Fixed for Mobile */}
      <div className="px-5 pb-6 space-y-3">
        {/* CTA Buttons */}
        <Button 
          className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 rounded-xl shadow-lg"
          size="lg"
          onClick={() => navigate('/auth?mode=signup')}
        >
          Get Started
        </Button>
        <Button 
          variant="outline"
          className="w-full h-14 text-base font-semibold border-2 border-primary text-primary hover:bg-primary/5 rounded-xl"
          size="lg"
          onClick={() => navigate('/auth?mode=signin')}
        >
          Sign In
        </Button>

        {/* Reassurance text */}
        <p className="text-center text-xs text-muted-foreground pt-2 px-4">
          Your privacy matters. All conversations are encrypted and anonymous.
        </p>
      </div>

      {/* Footer - Crisis notice */}
      <footer className="px-5 pb-4 pt-2">
        <p className="text-center text-xs text-muted-foreground/70">
          If you're in crisis, please contact a mental health professional or call your local emergency services.
        </p>
      </footer>
      
      {/* Safe Area Bottom Spacer */}
      <div className="h-safe-bottom bg-background" />
    </div>
  );
};

export default Index;
