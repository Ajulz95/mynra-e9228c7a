import { Button } from "@/components/ui/button";
import { Heart, Shield, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-primary">Vestra</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="max-w-md mx-auto w-full space-y-8">
          {/* Illustration placeholder with calming visual */}
          <div className="relative mx-auto w-48 h-48">
            <div className="absolute inset-0 bg-secondary/20 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-secondary/30 rounded-full" />
            <div className="absolute inset-8 bg-secondary/50 rounded-full flex items-center justify-center">
              <Users className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary text-balance">
              You're Not Alone in This
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Connect with peers who understand. Share your journey in a safe, 
              supportive space where healing happens together.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-secondary" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-accent" />
              <span>Peer Support</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/90"
              size="lg"
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              className="w-full h-14 text-lg font-medium border-primary text-primary hover:bg-primary/5"
              size="lg"
            >
              Sign In
            </Button>
          </div>

          {/* Reassurance text */}
          <p className="text-center text-sm text-muted-foreground">
            Your privacy matters. All conversations are encrypted and anonymous.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          If you're in crisis, please contact a mental health professional or call your local emergency services.
        </p>
      </footer>
    </div>
  );
};

export default Index;
