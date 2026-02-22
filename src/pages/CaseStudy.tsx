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
  Loader2,
  Database,
  Server,
  GitBranch,
  Activity,
  Zap,
  BarChart3,
  Workflow,
  ShieldCheck,
  Eye,
  Cpu,
  Code,
  Boxes,
  Rocket,
  Network
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

        {/* Backend Architecture Deep Dive */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Backend Architecture Deep Dive</h2>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            Mynra's backend is built on a serverless PostgreSQL architecture with real-time capabilities,
            enforcing privacy and security at the database layer through Row Level Security policies and
            server-side trigger functions.
          </p>

          {/* Architecture Diagram */}
          <Card className="bg-muted/30 mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-primary" />
                System Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-sm font-semibold text-primary mb-2">Client Layer</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>React 18 + TypeScript</p>
                    <p>React Query (Cache & Sync)</p>
                    <p>Supabase JS Client</p>
                    <p>Capacitor (Mobile Bridge)</p>
                  </div>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="text-sm font-semibold text-accent mb-2">API & Auth Layer</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>PostgREST Auto-Generated API</p>
                    <p>GoTrue Auth (JWT)</p>
                    <p>Edge Functions (Deno)</p>
                    <p>Realtime WebSocket Server</p>
                  </div>
                </div>
                <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                  <div className="text-sm font-semibold text-primary mb-2">Data Layer</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>PostgreSQL 15</p>
                    <p>Row Level Security (RLS)</p>
                    <p>Database Functions & Triggers</p>
                    <p>Automated Migrations</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-8 h-px bg-primary/40"></div>
                  <span>Encrypted at rest & in transit</span>
                  <div className="w-8 h-px bg-primary/40"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Flow */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-primary" />
              Data Flow & Event Pipeline
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">1</div>
                <div>
                  <div className="font-medium text-foreground">User Action</div>
                  <p className="text-sm text-muted-foreground">Client sends authenticated request via Supabase JS SDK with JWT token</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">2</div>
                <div>
                  <div className="font-medium text-foreground">RLS Policy Enforcement</div>
                  <p className="text-sm text-muted-foreground">PostgreSQL evaluates Row Level Security policies using <code className="text-xs bg-muted px-1 rounded">auth.uid()</code> — ensuring users can only access their own data</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">3</div>
                <div>
                  <div className="font-medium text-foreground">Trigger Cascade</div>
                  <p className="text-sm text-muted-foreground">Database triggers fire on mutations — auto-creating profiles, updating gamification stats, sending notifications</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">4</div>
                <div>
                  <div className="font-medium text-foreground">Realtime Broadcast</div>
                  <p className="text-sm text-muted-foreground">Changes propagate via WebSocket to subscribed clients — powering live chat, notifications, and match alerts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Model */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Security & Privacy Model
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <Lock className="w-5 h-5 text-primary mb-2" />
                  <div className="font-medium text-sm mb-1">Row Level Security</div>
                  <p className="text-xs text-muted-foreground">
                    Every table enforces RLS policies. Journal entries, boundaries, and symptom logs 
                    are strictly user-scoped — no admin backdoor, no data leaks between users.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Eye className="w-5 h-5 text-primary mb-2" />
                  <div className="font-medium text-sm mb-1">Security Definer Functions</div>
                  <p className="text-xs text-muted-foreground">
                    Cross-user queries (matching, connection status) use <code className="bg-muted px-1 rounded">SECURITY DEFINER</code> functions 
                    that expose only boolean results — never raw user data.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Shield className="w-5 h-5 text-primary mb-2" />
                  <div className="font-medium text-sm mb-1">Pseudonymous Identity</div>
                  <p className="text-xs text-muted-foreground">
                    Auto-generated pseudonyms (<code className="bg-muted px-1 rounded">Mynra_</code> prefix) via database trigger on signup. 
                    Real names are never required or stored.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Zap className="w-5 h-5 text-primary mb-2" />
                  <div className="font-medium text-sm mb-1">Progressive Trust</div>
                  <p className="text-xs text-muted-foreground">
                    Voice calls unlock only after 20 mutual messages — enforced by a server-side 
                    function, not client-side checks, preventing bypass.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Database Functions with Code Snippets */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              Core Rules & Logic — Code Snippets
            </h3>

            {/* RLS Policy Code */}
            <Card className="bg-muted/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-primary/10 border-b border-primary/10">
                  <code className="text-xs font-mono text-primary font-semibold">Row Level Security — Journal Entries</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`-- Users can ONLY access their own journal entries
-- Enforced at PostgreSQL engine level, not application code
CREATE POLICY "Users can manage their own journal entries"
ON public.journal_entries
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Even with a compromised API, cross-user data access
-- is rejected by the database engine itself.`}
                </pre>
              </CardContent>
            </Card>

            {/* Dual Consent Matching */}
            <Card className="bg-muted/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-accent/10 border-b border-accent/10">
                  <code className="text-xs font-mono text-accent font-semibold">Dual-Consent Matching — are_users_matched()</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`-- Both users must independently accept each other
-- This prevents one-sided connections
CREATE FUNCTION are_users_matched(user1_id uuid, user2_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM connection_requests
    WHERE requester_id = user1_id
      AND recipient_id = user2_id
      AND status = 'accepted'
  ) AND EXISTS (
    SELECT 1 FROM connection_requests
    WHERE requester_id = user2_id
      AND recipient_id = user1_id
      AND status = 'accepted'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;`}
                </pre>
              </CardContent>
            </Card>

            {/* Progressive Trust Gate */}
            <Card className="bg-muted/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-secondary/20 border-b border-secondary/20">
                  <code className="text-xs font-mono text-primary font-semibold">Progressive Trust Gate — Voice Call Unlock</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`-- Voice calls require 20+ messages from BOTH users
-- Server-enforced, not client-side — prevents bypass
CREATE FUNCTION is_voice_call_unlocked(
  user1_id uuid, user2_id uuid
) RETURNS boolean AS $$
  SELECT
    count_user_messages_in_conversation(
      user1_id, get_conversation_id(user1_id, user2_id)
    ) >= 20
    AND
    count_user_messages_in_conversation(
      user2_id, get_conversation_id(user1_id, user2_id)
    ) >= 20;
$$ LANGUAGE sql STABLE SECURITY DEFINER;`}
                </pre>
              </CardContent>
            </Card>

            {/* Gamification Trigger */}
            <Card className="bg-muted/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-accent/10 border-b border-accent/10">
                  <code className="text-xs font-mono text-accent font-semibold">Gentle Streak Engine — Gamification Trigger</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`-- Trigger fires on every challenge completion
-- Key insight: streaks FREEZE on missed days, never reset
CREATE FUNCTION update_gamification_on_completion()
RETURNS trigger AS $$
DECLARE
  days_since_last INTEGER;
BEGIN
  -- Calculate gap since last activity
  days_since_last := NEW.completed_date
    - stats_record.last_active_date;

  IF days_since_last = 0 THEN
    -- Same day: just add points
    UPDATE user_gamification_stats
    SET total_points = total_points + NEW.points_earned;
  ELSIF days_since_last = 1 THEN
    -- Consecutive day: increment streak
    UPDATE user_gamification_stats
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak,
                                   current_streak + 1);
  ELSE
    -- Missed days: FREEZE streak (no penalty)
    -- This is critical for mental health apps —
    -- punishing users for breaks causes harm
    UPDATE user_gamification_stats
    SET last_active_date = NEW.completed_date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}
                </pre>
              </CardContent>
            </Card>

            {/* Connection State Machine */}
            <Card className="bg-muted/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-primary/10 border-b border-primary/10">
                  <code className="text-xs font-mono text-primary font-semibold">Connection State Machine — get_connection_status()</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`-- Returns deterministic state for any user pair
-- Powers the entire connection UI lifecycle
CREATE FUNCTION get_connection_status(
  current_user_id uuid, other_user_id uuid
) RETURNS text AS $$
  SELECT CASE
    WHEN are_users_matched(current_user_id,
                           other_user_id)
      THEN 'matched'
    WHEN EXISTS (SELECT 1 FROM connection_requests
      WHERE requester_id = current_user_id
        AND recipient_id = other_user_id
        AND status = 'pending')
      THEN 'pending_sent'
    WHEN EXISTS (SELECT 1 FROM connection_requests
      WHERE requester_id = other_user_id
        AND recipient_id = current_user_id
        AND status = 'pending')
      THEN 'pending_received'
    ELSE 'none'
  END;
$$ LANGUAGE sql STABLE SECURITY DEFINER;`}
                </pre>
              </CardContent>
            </Card>

            {/* NLP Theme Extraction */}
            <Card className="bg-muted/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-secondary/20 border-b border-secondary/20">
                  <code className="text-xs font-mono text-primary font-semibold">Client-Side NLP — Theme Extraction Engine</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`// Runs entirely on-device — no journal text
// ever leaves the user's browser
const extractThemes = (entries: JournalEntry[]) => {
  const stopWords = new Set([
    'the','a','an','and','or','but','in','on',
    'feel','felt','today','really','things',...
  ]);

  const wordCounts: Record<string, number> = {};
  entries.forEach(entry => {
    const words = entry.content
      .toLowerCase()
      .replace(/[^a-z\\s]/g, '')
      .split(/\\s+/)
      .filter(w => w.length > 3
                 && !stopWords.has(w));

    words.forEach(word => {
      wordCounts[word] =
        (wordCounts[word] || 0) + 1;
    });
  });

  // Surface recurring themes
  return Object.entries(wordCounts)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
};`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Behavioral Intelligence Engine */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Behavioral Intelligence Engine</h2>
          </div>

          <p className="text-lg text-muted-foreground mb-4">
            At the core of Mynra is a behavioral intelligence engine that transforms raw emotional data
            into actionable growth pathways — helping users understand, track, and evolve their mental
            health journey over time.
          </p>

          <Card className="border-l-4 border-l-accent bg-accent/5 mb-8">
            <CardContent className="p-6">
              <p className="text-foreground font-medium italic">
                "We don't just store data — we surface patterns that help users see their own growth,
                turning scattered feelings into structured self-awareness."
              </p>
            </CardContent>
          </Card>

          {/* Multi-Signal Capture */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              Multi-Signal Emotional Capture
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              The engine captures emotional data across four dimensions per journal entry,
              plus freeform content and user-generated tags — creating a rich behavioral dataset.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">😊</div>
                  <div className="text-sm font-medium">Mood</div>
                  <div className="text-xs text-muted-foreground">1-10 scale</div>
                  <div className="text-xs text-muted-foreground mt-1">Core emotional state</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm font-medium">Energy</div>
                  <div className="text-xs text-muted-foreground">1-10 scale</div>
                  <div className="text-xs text-muted-foreground mt-1">Physical vitality</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">💭</div>
                  <div className="text-sm font-medium">Anxiety</div>
                  <div className="text-xs text-muted-foreground">1-10 scale</div>
                  <div className="text-xs text-muted-foreground mt-1">Stress indicator</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">🌙</div>
                  <div className="text-sm font-medium">Sleep</div>
                  <div className="text-xs text-muted-foreground">1-10 scale</div>
                  <div className="text-xs text-muted-foreground mt-1">Rest quality</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Intelligence Pipeline */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              Intelligence Pipeline
            </h3>
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent">1</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Data Ingestion</div>
                      <p className="text-sm text-muted-foreground">
                        Quick mood logs and full journal entries flow into <code className="text-xs bg-background px-1 rounded">journal_entries</code> and 
                        <code className="text-xs bg-background px-1 rounded">symptom_logs</code> tables with timestamps, 
                        creating a time-series behavioral dataset.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent">2</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Trend Analysis</div>
                      <p className="text-sm text-muted-foreground">
                        The MoodTrends engine aggregates entries over 7/14/30-day windows, computing rolling 
                        averages across all four emotional dimensions. Multi-line Recharts visualizations reveal 
                        correlations (e.g., low sleep → high anxiety).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent">3</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">NLP Theme Extraction</div>
                      <p className="text-sm text-muted-foreground">
                        The ThemeCloud processor runs client-side NLP: tokenization, stop-word filtering, 
                        and frequency analysis on journal content. Combined with user tags, it surfaces 
                        recurring emotional themes — making the invisible visible.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent">4</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Behavioral Reinforcement</div>
                      <p className="text-sm text-muted-foreground">
                        The gamification engine rewards consistent self-reflection with points and streaks. 
                        A "gentle freeze" algorithm preserves streaks during breaks — avoiding punishment 
                        loops that harm mental health apps.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emotional Growth Pathways */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              Emotional Growth Pathways
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              The engine maps each user's journey through progressive growth stages,
              adapting the experience based on their behavioral data.
            </p>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-primary/40">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🌱</span>
                    <div className="font-semibold text-foreground">Stage 1: Exploring</div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-9">
                    New users begin with guided onboarding that captures their journey stage, challenges, 
                    and boundaries. The system adapts prompts and peer suggestions based on initial self-assessment.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">📊</span>
                    <div className="font-semibold text-foreground">Stage 2: Self-Awareness</div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-9">
                    As users log moods and journal consistently, trend visualizations reveal patterns. 
                    Theme clouds surface unconscious recurring topics. Users begin identifying triggers 
                    and correlations (sleep ↔ anxiety, energy ↔ mood).
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent/60">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🤝</span>
                    <div className="font-semibold text-foreground">Stage 3: Peer Connection</div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-9">
                    The dual-consent matching system connects users who share challenges. Progressive trust 
                    gating (boundaries → text → 20-message threshold → voice) builds authentic relationships 
                    while maintaining safety.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🌟</span>
                    <div className="font-semibold text-foreground">Stage 4: Active Growth</div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-9">
                    Daily challenges, mindfulness activities, and creative exercises provide structured growth. 
                    The gentle streak system rewards consistency without punishing breaks — critical for mental health contexts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">💪</span>
                    <div className="font-semibold text-foreground">Stage 5: Supporting Others</div>
                  </div>
                  <p className="text-sm text-muted-foreground ml-9">
                    Users in later journey stages can shift to "supporting others" mode — completing the 
                    cycle by becoming peer mentors. Their insights become the foundation of community resilience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Differentiators */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">What Makes This Engine Different</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <Sparkles className="w-6 h-6 text-accent mb-2" />
                  <div className="font-medium text-sm mb-1">No-Guilt Design</div>
                  <p className="text-xs text-muted-foreground">
                    Streaks freeze instead of resetting. No push notifications guilt-tripping users. 
                    Growth is celebrated, pauses are respected.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Lock className="w-6 h-6 text-primary mb-2" />
                  <div className="font-medium text-sm mb-1">Data Never Leaves</div>
                  <p className="text-xs text-muted-foreground">
                    Emotional data stays in the user's private scope. No aggregation, no selling, 
                    no third-party analytics on feelings. RLS enforced at DB level.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <Brain className="w-6 h-6 text-primary mb-2" />
                  <div className="font-medium text-sm mb-1">Therapist-Ready Insights</div>
                  <p className="text-xs text-muted-foreground">
                    Trend data and theme clouds are designed to be shareable with mental health 
                    professionals — bridging self-reflection and clinical support.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Backend Behavioral Data Tracking — Investor Deep Dive */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Backend Behavioral Data Tracking</h2>
          </div>

          <Card className="border-l-4 border-l-primary bg-primary/5 mb-8">
            <CardContent className="p-6">
              <p className="text-foreground font-medium italic">
                "Every interaction — mood log, journal entry, peer connection, challenge completion — is a behavioral 
                signal captured, stored, and analyzed on the backend. Here's exactly how we do it and why our stack 
                makes this a defensible, unique system."
              </p>
            </CardContent>
          </Card>

          {/* What We Track */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              What We Track on the Backend
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Every data point below is persisted in PostgreSQL with timestamps, user-scoped via Row Level Security, 
              and available for longitudinal analysis. This isn't client-side localStorage — it's durable, queryable, real-time behavioral data.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="font-medium text-sm mb-2 text-foreground">📊 Emotional Time-Series</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• <code className="bg-muted px-1 rounded">journal_entries</code> — mood, energy, anxiety, sleep (4-dimensional scoring per entry)</p>
                    <p>• <code className="bg-muted px-1 rounded">symptom_logs</code> — discrete symptom tracking with intensity & freeform notes</p>
                    <p>• Every entry timestamped for time-series aggregation across days/weeks/months</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="font-medium text-sm mb-2 text-foreground">🏷️ Semantic Behavioral Tags</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• User-generated tags stored as PostgreSQL arrays on <code className="bg-muted px-1 rounded">journal_entries.tags[]</code></p>
                    <p>• Client-side NLP extracts recurring themes from freeform content (tokenization + frequency analysis)</p>
                    <p>• Combined tag + word frequency creates a behavioral fingerprint over time</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="font-medium text-sm mb-2 text-foreground">🤝 Social Behavioral Signals</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• <code className="bg-muted px-1 rounded">connection_requests</code> — tracks connection lifecycle (pending → accepted → matched)</p>
                    <p>• <code className="bg-muted px-1 rounded">messages</code> — message count per conversation drives progressive trust gating</p>
                    <p>• Server-side functions compute relationship depth (e.g., 20-message voice unlock threshold)</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="font-medium text-sm mb-2 text-foreground">🎯 Engagement & Growth Metrics</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• <code className="bg-muted px-1 rounded">user_gamification_stats</code> — points, streaks, longest streak, last active date</p>
                    <p>• <code className="bg-muted px-1 rounded">user_challenge_completions</code> — challenge-level completion with points earned</p>
                    <p>• <code className="bg-muted px-1 rounded">user_journey_stages</code> — explicit growth stage tracking (exploring → supporting others)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How We Track It */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              How the Tech Stack Makes This Unique
            </h3>

            <div className="space-y-4">
              <Card className="bg-muted/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">PostgreSQL as the Behavioral Data Warehouse</div>
                      <p className="text-sm text-muted-foreground">
                        Unlike NoSQL approaches, our PostgreSQL backend enables <strong>relational queries across behavioral dimensions</strong>. 
                        We can JOIN mood trends with challenge completions, correlate sleep quality with social engagement patterns, 
                        and run window functions for rolling averages — all at the database layer. This is a proper analytical foundation, 
                        not a flat data dump.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">Server-Side Trigger Intelligence</div>
                      <p className="text-sm text-muted-foreground">
                        Database triggers (<code className="bg-background px-1 rounded text-xs">update_gamification_on_completion</code>, 
                        <code className="bg-background px-1 rounded text-xs">notify_connection_accepted</code>) react to behavioral events in real-time. 
                        When a user completes a challenge, the trigger <strong>automatically computes streak logic, updates points, and determines 
                        if this is a consecutive day</strong> — all atomically within the transaction. No cron jobs, no delayed batch processing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">RLS-Enforced Privacy as a Competitive Moat</div>
                      <p className="text-sm text-muted-foreground">
                        Row Level Security means behavioral data isolation is <strong>enforced at the database engine level</strong>, not in application code. 
                        Even if our API has a bug, PostgreSQL will reject cross-user data access. For a mental health product, this isn't just a feature — 
                        it's a <strong>regulatory and trust advantage</strong> that most competitors implement only in middleware (bypassable).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Workflow className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">Hybrid Client + Server Analysis Pipeline</div>
                      <p className="text-sm text-muted-foreground">
                        Our analysis runs at two layers: <strong>client-side NLP</strong> (theme extraction, word frequency) keeps sensitive 
                        content processing on-device, while <strong>server-side functions</strong> handle cross-entity logic (matching, trust gating, 
                        gamification). This hybrid approach means we get real-time intelligence without shipping raw journal text to external AI services.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">Recommendation Engine Architecture</div>
                      <p className="text-sm text-muted-foreground">
                        The recommendation layer combines: <strong>(1)</strong> journey stage + challenge overlap for peer matching, 
                        <strong>(2)</strong> mood trend direction for adaptive daily challenges, 
                        <strong>(3)</strong> engagement frequency for streak-sensitive nudging, and 
                        <strong>(4)</strong> content themes for personalized activity suggestions. 
                        Each signal feeds a scoring model that evolves with the user — this is <strong>compound behavioral intelligence</strong>, 
                        not a static rules engine.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Why This Is Defensible */}
          <Card className="border-l-4 border-l-accent bg-accent/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Why This Is Defensible</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-foreground mb-1">📈 Data Flywheel</div>
                  <p className="text-xs text-muted-foreground">
                    Every user interaction enriches the behavioral dataset. More data → better trend detection → 
                    more relevant recommendations → higher engagement → more data. This compounds over time.
                  </p>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">🔒 Privacy-First Moat</div>
                  <p className="text-xs text-muted-foreground">
                    Competitors who aggregate behavioral data face regulatory risk (HIPAA, GDPR). Our user-scoped, 
                    RLS-enforced architecture is privacy-compliant by design — not by policy.
                  </p>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-1">🧠 Switching Cost</div>
                  <p className="text-xs text-muted-foreground">
                    As users build months of emotional history, trend data, and peer relationships, the platform 
                    becomes a personal emotional record — creating natural retention and high switching costs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Full Tech Stack */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Boxes className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Full Tech Stack</h2>
          </div>

          <p className="text-muted-foreground mb-6 text-sm">
            Every technology choice serves the product's core mission: safe, private, real-time emotional intelligence.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  Frontend
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>React 18</span><span className="text-primary font-medium">UI Framework</span></div>
                  <div className="flex justify-between"><span>TypeScript</span><span className="text-primary font-medium">Type Safety</span></div>
                  <div className="flex justify-between"><span>Vite</span><span className="text-primary font-medium">Build Tool</span></div>
                  <div className="flex justify-between"><span>Tailwind CSS</span><span className="text-primary font-medium">Styling</span></div>
                  <div className="flex justify-between"><span>shadcn/ui</span><span className="text-primary font-medium">Components</span></div>
                  <div className="flex justify-between"><span>Framer Motion</span><span className="text-primary font-medium">Animations</span></div>
                  <div className="flex justify-between"><span>Recharts</span><span className="text-primary font-medium">Visualizations</span></div>
                  <div className="flex justify-between"><span>React Query</span><span className="text-primary font-medium">Data Sync</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Server className="w-4 h-4 text-accent" />
                  Backend
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>PostgreSQL 15</span><span className="text-accent font-medium">Database</span></div>
                  <div className="flex justify-between"><span>PostgREST</span><span className="text-accent font-medium">Auto API</span></div>
                  <div className="flex justify-between"><span>GoTrue (JWT)</span><span className="text-accent font-medium">Auth</span></div>
                  <div className="flex justify-between"><span>Edge Functions</span><span className="text-accent font-medium">Serverless</span></div>
                  <div className="flex justify-between"><span>Deno Runtime</span><span className="text-accent font-medium">Functions</span></div>
                  <div className="flex justify-between"><span>Row Level Security</span><span className="text-accent font-medium">Data Privacy</span></div>
                  <div className="flex justify-between"><span>WebSocket Server</span><span className="text-accent font-medium">Realtime</span></div>
                  <div className="flex justify-between"><span>PL/pgSQL</span><span className="text-accent font-medium">Triggers</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-secondary" />
                  Intelligence
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Client NLP</span><span className="text-primary font-medium">Themes</span></div>
                  <div className="flex justify-between"><span>Time-Series</span><span className="text-primary font-medium">Trends</span></div>
                  <div className="flex justify-between"><span>Window Functions</span><span className="text-primary font-medium">Aggregation</span></div>
                  <div className="flex justify-between"><span>Trigger Pipeline</span><span className="text-primary font-medium">Events</span></div>
                  <div className="flex justify-between"><span>State Machine</span><span className="text-primary font-medium">Connections</span></div>
                  <div className="flex justify-between"><span>Streak Algorithm</span><span className="text-primary font-medium">Gamification</span></div>
                  <div className="flex justify-between"><span>Capacitor</span><span className="text-primary font-medium">Mobile</span></div>
                  <div className="flex justify-between"><span>html2pdf.js</span><span className="text-primary font-medium">Export</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* ML Augmentation — Scaling Phase */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Machine Learning Augmentation (Scaling Phase)</h2>
          </div>

          <Card className="border-l-4 border-l-primary bg-primary/5 mb-8">
            <CardContent className="p-6">
              <p className="text-foreground font-medium italic">
                "Our current rule-based engine is the foundation. The ML layer doesn't replace it — it amplifies it. 
                Every behavioral signal we already capture becomes training data for models that personalize the experience 
                at scale."
              </p>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Network className="w-4 h-4 text-accent" />
              ML Pipeline Architecture
            </h3>

            <Card className="bg-muted/30 overflow-hidden mb-6">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-accent/10 border-b border-accent/10">
                  <code className="text-xs font-mono text-accent font-semibold">ML Pipeline — Edge Function + AI Gateway</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`// Edge Function: Behavioral Embedding Generator
// Runs on Deno runtime, triggered by journal writes

serve(async (req) => {
  const { journal_entry, mood_history, tags } = 
    await req.json();

  // 1. Construct behavioral feature vector
  const features = {
    mood_trajectory: computeTrend(mood_history),
    theme_embedding: await generateEmbedding(
      journal_entry.content,
      { model: "google/gemini-2.5-flash" }
    ),
    engagement_score: calculateEngagement(
      mood_history.length, tags.length
    ),
    sleep_anxiety_correlation: pearsonR(
      mood_history.map(m => m.sleep_quality),
      mood_history.map(m => m.anxiety_level)
    ),
  };

  // 2. Store embedding for similarity matching
  await supabase.from('user_embeddings').upsert({
    user_id: user.id,
    embedding: features.theme_embedding,
    behavioral_vector: features,
  });

  // 3. Generate personalized recommendations
  const recs = await fetch(AI_GATEWAY_URL, {
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{
        role: 'system',
        content: \`Based on behavioral data:
          Mood trend: \${features.mood_trajectory}
          Themes: \${tags.join(', ')}
          Sleep↔Anxiety r=\${
            features.sleep_anxiety_correlation
          }
          Suggest 3 personalized activities.\`
      }]
    })
  });

  return new Response(JSON.stringify({
    recommendations: recs, features
  }));
});`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 overflow-hidden mb-6">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-primary/10 border-b border-primary/10">
                  <code className="text-xs font-mono text-primary font-semibold">Peer Matching — Embedding Similarity (pgvector)</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`-- pgvector: vector similarity search in PostgreSQL
-- Replaces rule-based matching with semantic matching

CREATE TABLE user_embeddings (
  user_id UUID PRIMARY KEY,
  embedding vector(768),
  behavioral_vector JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Find semantically similar peers
-- "I can't sleep" matches "insomnia keeps me up"
CREATE FUNCTION find_similar_peers(
  target_user_id UUID,
  match_limit INT DEFAULT 10
) RETURNS TABLE(user_id UUID, similarity FLOAT) AS $$
  SELECT
    ue.user_id,
    1 - (ue.embedding <=> target.embedding)
      AS similarity
  FROM user_embeddings ue
  CROSS JOIN user_embeddings target
  WHERE target.user_id = target_user_id
    AND ue.user_id != target_user_id
  ORDER BY ue.embedding <=> target.embedding
  LIMIT match_limit;
$$ LANGUAGE sql STABLE SECURITY DEFINER;`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 overflow-hidden mb-6">
              <CardContent className="p-0">
                <div className="px-4 py-2 bg-secondary/20 border-b border-secondary/20">
                  <code className="text-xs font-mono text-primary font-semibold">Predictive Mood Forecasting</code>
                </div>
                <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
{`// Predicts next 3 days based on historical patterns
const forecastMood = async (userId: string) => {
  const { data: history } = await supabase
    .from('journal_entries')
    .select('mood, energy_level, anxiety_level, 
             sleep_quality, created_at')
    .eq('user_id', userId)
    .gte('created_at', thirtyDaysAgo)
    .order('created_at');

  // Feature engineering
  const features = {
    weekday_patterns: groupByDayOfWeek(history),
    rolling_avg_7d: rollingAverage(history, 7),
    volatility: stdDev(history.map(h => h.mood)),
    sleep_mood_lag: lagCorrelation(
      history.map(h => h.sleep_quality),
      history.map(h => h.mood),
      1  // 1-day lag
    ),
  };

  // AI-powered prediction via gateway
  const prediction = await aiGateway.complete({
    model: 'google/gemini-2.5-flash',
    prompt: \`Behavioral patterns:
      Weekly: \${JSON.stringify(
        features.weekday_patterns)}
      7d trend: \${features.rolling_avg_7d}
      Volatility: \${features.volatility}
      Sleep→Mood lag: \${features.sleep_mood_lag}
      
      Predict mood for next 3 days.
      Suggest proactive interventions.\`
  });

  return prediction;
};`}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* ML Capabilities Grid */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-4">ML-Powered Capabilities (Scaling Roadmap)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-accent/60">
                <CardContent className="p-4">
                  <div className="font-semibold text-sm text-foreground mb-2">🧬 Semantic Peer Matching</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Replace tag-based matching with embedding similarity. Users writing about similar themes 
                    get matched even if they use different words.
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded">pgvector</span>
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded">Gemini Embeddings</span>
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded">Cosine Similarity</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary/60">
                <CardContent className="p-4">
                  <div className="font-semibold text-sm text-foreground mb-2">📈 Predictive Mood Forecasting</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Detect patterns like "mood drops every Sunday" and proactively suggest 
                    interventions before the dip happens.
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">Time-Series</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">Lag Correlation</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">AI Gateway</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary/60">
                <CardContent className="p-4">
                  <div className="font-semibold text-sm text-foreground mb-2">🎯 Adaptive Challenge Engine</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Daily challenges adapt to behavioral data — breathing exercises when anxiety trends high, 
                    social challenges when isolation patterns emerge.
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-secondary/20 text-primary text-xs rounded">Reinforcement Learning</span>
                    <span className="px-2 py-0.5 bg-secondary/20 text-primary text-xs rounded">Multi-Armed Bandit</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4">
                  <div className="font-semibold text-sm text-foreground mb-2">🛡️ Content Safety & Sentiment</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Real-time sentiment analysis on messages to detect crisis signals with automatic 
                    escalation to crisis resources while maintaining privacy.
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded">Sentiment Analysis</span>
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded">Crisis Detection</span>
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded">Edge Functions</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ML Tech Stack */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-accent" />
                ML Infrastructure Stack
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-muted-foreground"><strong className="text-foreground">AI Gateway</strong> — Multi-model access (Gemini, GPT-5) without API key management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-muted-foreground"><strong className="text-foreground">pgvector</strong> — Vector similarity search directly in PostgreSQL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-muted-foreground"><strong className="text-foreground">Edge Functions (Deno)</strong> — Serverless ML inference at the edge</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-muted-foreground"><strong className="text-foreground">Gemini 2.5 Flash</strong> — Fast, cost-efficient embeddings & recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-muted-foreground"><strong className="text-foreground">PostgreSQL Window Functions</strong> — Rolling averages & time-series at DB layer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-muted-foreground"><strong className="text-foreground">On-Device NLP</strong> — Privacy-preserving text analysis (no data leaves browser)</span>
                  </div>
                </div>
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
