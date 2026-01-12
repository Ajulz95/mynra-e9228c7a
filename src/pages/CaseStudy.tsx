import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Heart, 
  Users, 
  Shield, 
  Brain, 
  MessageCircle, 
  TrendingUp,
  Sparkles,
  Lock,
  Target,
  Lightbulb,
  Palette,
  Layers,
  CheckCircle2,
  ArrowRight,
  Download,
  Loader2
} from 'lucide-react';

export default function CaseStudy() {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    
    setIsExporting(true);
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'Mynra-Case-Study.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(contentRef.current).save();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Export Button */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="bg-accent hover:bg-accent/90 text-white shadow-lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
      </div>

      <div ref={contentRef}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10 mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              Product Case Study
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Mynra
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
              A mental health peer-connection platform designed to foster safe, 
              meaningful connections between individuals navigating similar challenges.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-3 py-1 bg-secondary/30 rounded-full text-sm">Mental Health</span>
              <span className="px-3 py-1 bg-secondary/30 rounded-full text-sm">Peer Support</span>
              <span className="px-3 py-1 bg-secondary/30 rounded-full text-sm">Mobile-First</span>
              <span className="px-3 py-1 bg-secondary/30 rounded-full text-sm">React + Supabase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mx-auto px-6 -mt-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">Core Features</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">12+</div>
                <div className="text-sm text-muted-foreground">Screens</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Privacy-First</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">PWA</div>
                <div className="text-sm text-muted-foreground">Ready</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        
        {/* Problem Statement */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">The Problem</h2>
          </div>
          
          <Card className="border-l-4 border-l-accent bg-accent/5">
            <CardContent className="p-6">
              <p className="text-lg text-foreground leading-relaxed">
                Millions of people struggle with mental health challenges in isolation. 
                Traditional support systems can be inaccessible, expensive, or stigmatized. 
                There's a critical gap between professional therapy and informal support—a 
                space where individuals can connect with others who truly understand their experiences.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold text-foreground mb-1">Isolation</div>
              <p className="text-sm text-muted-foreground">Many feel alone in their mental health journey</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold text-foreground mb-1">Accessibility</div>
              <p className="text-sm text-muted-foreground">Professional help isn't always available or affordable</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold text-foreground mb-1">Stigma</div>
              <p className="text-sm text-muted-foreground">Fear of judgment prevents people from seeking support</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Solution */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">The Solution</h2>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            Mynra bridges the gap by creating a safe, anonymous platform where users 
            can connect with peers who share similar challenges—fostering genuine 
            understanding and mutual support.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-lift">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Peer Matching</h3>
                <p className="text-muted-foreground">
                  Intelligent matching based on shared challenges, journey stage, 
                  and support preferences ensures meaningful connections.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardContent className="p-6">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Privacy by Design</h3>
                <p className="text-muted-foreground">
                  Pseudonymous profiles, customizable boundaries, and encrypted 
                  communications protect user identity and safety.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardContent className="p-6">
                <Brain className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Self-Reflection Tools</h3>
                <p className="text-muted-foreground">
                  Private journaling, mood tracking, and trend analysis help 
                  users understand patterns in their mental health journey.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardContent className="p-6">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Gamified Self-Care</h3>
                <p className="text-muted-foreground">
                  Daily challenges and activities encourage consistent engagement 
                  with wellness practices through positive reinforcement.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Key Features Deep Dive */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Feature Deep Dive</h2>
          </div>

          <div className="space-y-8">
            {/* Onboarding */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Thoughtful Onboarding</h3>
                <p className="text-muted-foreground mb-3">
                  A 5-step guided onboarding captures the user's mental health journey stage, 
                  personal challenges, support preferences, communication boundaries, and 
                  creates their pseudonymous profile.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-xs rounded">Journey Stage</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Challenges</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Support Preferences</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Boundaries</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Profile</span>
                </div>
              </div>
            </div>

            {/* Discover */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Peer Discovery</h3>
                <p className="text-muted-foreground mb-3">
                  Users browse profiles sorted by shared challenges. A mutual connection 
                  system ensures both parties consent before matching—preventing unwanted 
                  contact and building trust.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-xs rounded">Smart Matching</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Mutual Consent</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Challenge Tags</span>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Safe Conversations</h3>
                <p className="text-muted-foreground mb-3">
                  Real-time messaging with guided conversation starters for new connections. 
                  Voice calls unlock after 20 messages from each party—encouraging gradual 
                  trust-building.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-xs rounded">Real-time</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Guided Prompts</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Progressive Unlock</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Report System</span>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Personal Sanctuary</h3>
                <p className="text-muted-foreground mb-3">
                  A private space for journaling, mood tracking (synced across Home and Insights), 
                  energy/anxiety/sleep logging, and visualizing emotional trends over time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-xs rounded">Daily Mood</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Journal</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Trend Charts</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Theme Cloud</span>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-primary">5</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Gamified Wellness</h3>
                <p className="text-muted-foreground mb-3">
                  Daily self-care challenges with points and streaks encourage consistent 
                  engagement. Activities hub includes mindfulness, creative expression, 
                  and social challenges.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-muted text-xs rounded">Daily Challenges</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Points System</span>
                  <span className="px-2 py-1 bg-muted text-xs rounded">Streaks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Design System */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Design System</h2>
          </div>

          <p className="text-muted-foreground mb-8">
            Every visual decision in Mynra was made with mental wellness in mind—calming 
            colors, gentle animations, and accessible typography.
          </p>

          {/* Color Palette */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="h-20 rounded-lg bg-primary mb-2"></div>
                <div className="text-sm font-medium">Primary</div>
                <div className="text-xs text-muted-foreground">Deep Teal</div>
              </div>
              <div>
                <div className="h-20 rounded-lg bg-secondary mb-2"></div>
                <div className="text-sm font-medium">Secondary</div>
                <div className="text-xs text-muted-foreground">Sage Green</div>
              </div>
              <div>
                <div className="h-20 rounded-lg bg-accent mb-2"></div>
                <div className="text-sm font-medium">Accent</div>
                <div className="text-xs text-muted-foreground">Warm Gold</div>
              </div>
              <div>
                <div className="h-20 rounded-lg bg-muted border mb-2"></div>
                <div className="text-sm font-medium">Background</div>
                <div className="text-xs text-muted-foreground">Off-White</div>
              </div>
            </div>
          </div>

          {/* Design Principles */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Design Principles</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <Heart className="w-6 h-6 text-accent mb-2" />
                  <div className="font-medium mb-1">Calm & Comforting</div>
                  <p className="text-sm text-muted-foreground">
                    Soft gradients, rounded corners, and breathing room reduce cognitive load
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Lock className="w-6 h-6 text-primary mb-2" />
                  <div className="font-medium mb-1">Safe & Private</div>
                  <p className="text-sm text-muted-foreground">
                    Visual cues reinforce privacy—lock icons, "Private" badges, secure messaging
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <TrendingUp className="w-6 h-6 text-secondary mb-2" />
                  <div className="font-medium mb-1">Progress-Oriented</div>
                  <p className="text-sm text-muted-foreground">
                    Trend visualizations and streaks celebrate growth without pressure
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Technical Architecture */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Technical Architecture</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Frontend Stack</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">React 18 with TypeScript</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Vite for fast builds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Tailwind CSS + shadcn/ui</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">React Query for data fetching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Framer Motion animations</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">Backend & Data</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Supabase (PostgreSQL)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Row Level Security (RLS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Real-time subscriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Edge Functions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">Capacitor for mobile</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Database Schema Overview */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Core Data Models</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-2 bg-background rounded">profiles</div>
                <div className="p-2 bg-background rounded">messages</div>
                <div className="p-2 bg-background rounded">connection_requests</div>
                <div className="p-2 bg-background rounded">journal_entries</div>
                <div className="p-2 bg-background rounded">symptom_logs</div>
                <div className="p-2 bg-background rounded">user_boundaries</div>
                <div className="p-2 bg-background rounded">daily_challenges</div>
                <div className="p-2 bg-background rounded">notifications</div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Outcomes & Future */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Outcomes & Next Steps</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Key Achievements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5" />
                  <span className="text-muted-foreground">
                    Built a complete peer-connection platform from concept to deployment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5" />
                  <span className="text-muted-foreground">
                    Implemented privacy-first architecture with RLS and pseudonymous profiles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5" />
                  <span className="text-muted-foreground">
                    Created intuitive onboarding that captures complex user preferences
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5" />
                  <span className="text-muted-foreground">
                    Designed calming UI that supports mental wellness goals
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Future Roadmap</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-muted-foreground">
                    AI-powered matching algorithm using embeddings
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-muted-foreground">
                    Group support circles for shared experiences
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-muted-foreground">
                    Integration with mental health professionals
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-accent mt-0.5" />
                  <span className="text-muted-foreground">
                    Mindfulness games and creative corner features
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="text-center py-8">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
            <CardContent className="p-8">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Experience Mynra
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Ready to explore the platform? Return to the app and start your journey.
              </p>
              <Button 
                onClick={() => navigate('/home')}
                className="bg-primary hover:bg-primary/90"
              >
                Go to Home
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
