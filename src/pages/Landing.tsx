import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MynraLogo } from "@/components/MynraLogo";
import { useDarkMode } from "@/hooks/useDarkMode";
import {
  Moon, Sun, Shield, Users, BarChart3, MessageCircle, Flame, PhoneCall,
  Lock, UserX, ShieldCheck, AlertTriangle, Leaf, Gamepad2, Palette,
  Music, Sparkles, Heart, ArrowRight, ChevronRight, Brain,
  Fingerprint, TrendingUp, Menu, X,
} from "lucide-react";
import { useState } from "react";

/* ─── helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── data ─── */
const pseudonyms = ["Calm Lotus", "Quiet Storm", "Steady River", "Gentle Breeze", "Bright Ember", "Soft Pebble"];

const features = [
  { icon: Fingerprint, title: "Anonymous Identity", desc: "Pseudonyms only. Your real name stays yours." },
  { icon: Users, title: "Peer Matching", desc: "Algorithm-matched peers based on shared challenges and journey stage." },
  { icon: BarChart3, title: "Mood Insights", desc: "Track emotional patterns over time with beautiful, private charts." },
  { icon: MessageCircle, title: "Guided Conversations", desc: "Conversation starters so you never stare at a blank message." },
  { icon: Flame, title: "Gentle Gamification", desc: "Streaks that freeze, not reset — no anxiety about \"breaking\" them." },
  { icon: PhoneCall, title: "Progressive Trust", desc: "Voice calls unlock only after safe interaction milestones." },
];

const steps = [
  { num: "01", title: "Create your anonymous profile", desc: "Choose a pseudonym, select your challenges, set your boundaries.", icon: Fingerprint },
  { num: "02", title: "Get matched with peers", desc: "Behavioral intelligence finds people who genuinely understand your experience.", icon: Brain },
  { num: "03", title: "Grow together", desc: "Chat, journal, complete self-care challenges, and track your emotional growth.", icon: TrendingUp },
];

const activities = [
  { icon: Leaf, label: "Daily Self-Care", desc: "Build calm daily routines" },
  { icon: Sparkles, label: "Mindfulness Games", desc: "Playful presence exercises" },
  { icon: Palette, label: "Creative Corner", desc: "Express through art & writing" },
  { icon: Music, label: "Sound Therapy", desc: "Curated calming soundscapes" },
  { icon: Gamepad2, label: "Fun Games", desc: "Light-hearted mood boosters" },
];

const trustSignals = [
  { icon: Lock, text: "End-to-end encrypted messages" },
  { icon: UserX, text: "No real names, ever" },
  { icon: ShieldCheck, text: "Row-level data security — your data is yours alone" },
  { icon: AlertTriangle, text: "Built-in crisis support access" },
];

const testimonials = [
  { name: "Calm Lotus", quote: "For the first time, I felt heard without being judged. Mynra gave me a space I didn't know I needed.", tag: "#Anxiety" },
  { name: "Steady River", quote: "The mood tracking helped me see patterns I was blind to. It's like a mirror for my emotions.", tag: "#ADHD" },
  { name: "Gentle Breeze", quote: "I love that streaks don't punish me. On bad days, Mynra still feels like a friend, not a taskmaster.", tag: "#Depression" },
];

/* ─── page ─── */
export default function Landing() {
  const { isDark, toggle } = useDarkMode();
  const [mobileNav, setMobileNav] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-['DM_Sans',sans-serif] overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
            <MynraLogo size="sm" />
            <span className="text-lg font-bold text-primary font-['DM_Serif_Display',serif]">Mynra</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollTo("features")} className="hover:text-foreground transition-colors">Features</button>
            <button onClick={() => scrollTo("how")} className="hover:text-foreground transition-colors">How It Works</button>
            <button onClick={() => scrollTo("activities")} className="hover:text-foreground transition-colors">Activities</button>
            <button onClick={() => scrollTo("trust")} className="hover:text-foreground transition-colors">Trust</button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button size="sm" className="hidden md:inline-flex bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Get Early Access
            </Button>
            <button className="md:hidden p-2" onClick={() => setMobileNav(!mobileNav)}>
              {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileNav && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background border-b border-border px-5 pb-4 flex flex-col gap-3 text-sm font-medium"
          >
            <button onClick={() => scrollTo("features")} className="text-left py-2 text-muted-foreground hover:text-foreground">Features</button>
            <button onClick={() => scrollTo("how")} className="text-left py-2 text-muted-foreground hover:text-foreground">How It Works</button>
            <button onClick={() => scrollTo("activities")} className="text-left py-2 text-muted-foreground hover:text-foreground">Activities</button>
            <button onClick={() => scrollTo("trust")} className="text-left py-2 text-muted-foreground hover:text-foreground">Trust</button>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full">
              Get Early Access
            </Button>
          </motion.div>
        )}
      </nav>

      {/* ── 1. Hero ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Gradient mesh bg */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/10" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px]" />
        </div>

        {/* Floating pseudonym chips */}
        <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
          {pseudonyms.map((name, i) => (
            <motion.div
              key={name}
              className="absolute"
              style={{
                top: `${15 + (i * 12) % 70}%`,
                left: `${5 + (i * 17) % 85}%`,
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, i % 2 === 0 ? 10 : -10, 0],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            >
              <Badge variant="secondary" className="bg-card/80 backdrop-blur-sm text-muted-foreground border border-border/50 shadow-sm text-xs px-3 py-1">
                {name}
              </Badge>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-['DM_Serif_Display',serif] text-foreground mb-6">
              You don't have to navigate this{" "}
              <span className="text-primary">alone.</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Connect with peers who truly get it — anonymously, safely, and on your terms.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-base font-semibold rounded-xl shadow-lg shadow-accent/20">
              Get Early Access <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-8 text-base font-semibold rounded-xl border border-border" onClick={() => scrollTo("how")}>
              See How It Works <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Problem → Solution ── */}
      <Section className="py-20 sm:py-28 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider uppercase">Why Mynra</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-['DM_Serif_Display',serif] text-foreground">
              The gap between struggle and support
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Pain */}
            <motion.div variants={fadeUp} className="space-y-6">
              <h3 className="text-sm font-bold tracking-wider uppercase text-muted-foreground mb-4">The reality</h3>
              {[
                "Therapy waitlists stretch for months",
                "Friends don't always understand",
                "Opening up feels risky without safety",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-destructive/70 shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">{t}</p>
                </div>
              ))}
            </motion.div>

            {/* Solution */}
            <motion.div variants={fadeUp} className="space-y-6">
              <h3 className="text-sm font-bold tracking-wider uppercase text-primary mb-4">How Mynra helps</h3>
              {[
                "Instant peer connection — no waitlists, no appointments",
                "Matched with people who share your challenges",
                "Built-in boundaries & anonymity keep you safe",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <p className="text-foreground leading-relaxed">{t}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── 3. Core Features ── */}
      <Section id="features" className="py-20 sm:py-28 px-5 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider uppercase">Core Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-['DM_Serif_Display',serif] text-foreground">
              Everything you need to feel supported
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Card className="h-full border-border/50 bg-card hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 4. How It Works ── */}
      <Section id="how" className="py-20 sm:py-28 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider uppercase">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-['DM_Serif_Display',serif] text-foreground">
              Three steps to a safer space
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num} variants={fadeUp} className="relative text-center">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
                  <s.icon className="w-8 h-8 text-primary" />
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 5. Activities ── */}
      <Section id="activities" className="py-20 sm:py-28 px-5 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider uppercase">Activities</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-['DM_Serif_Display',serif] text-foreground">
              Mood-boosting, not clinical
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-5 px-5">
            {activities.map((a) => (
              <Card key={a.label} className="min-w-[200px] snap-start border-border/50 bg-card hover:shadow-md transition-shadow shrink-0">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <a.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-1">{a.label}</h3>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── 6. Trust & Privacy ── */}
      <Section id="trust" className="py-20 sm:py-28 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider uppercase">Trust & Privacy</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-['DM_Serif_Display',serif] text-foreground">
              Your safety is non-negotiable
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustSignals.map((t) => (
              <div key={t.text} className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-card border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <t.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground leading-snug">{t.text}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── 7. Testimonials ── */}
      <Section className="py-20 sm:py-28 px-5 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold tracking-wider uppercase">Voices</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-['DM_Serif_Display',serif] text-foreground">
              What our peers say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="h-full border-border/50 bg-card">
                  <CardContent className="p-6 flex flex-col h-full">
                    <p className="text-sm text-muted-foreground leading-relaxed italic flex-1 mb-4">"{t.quote}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{t.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{t.tag}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 8. Final CTA ── */}
      <Section className="py-20 sm:py-28 px-5 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background" />
        </div>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold font-['DM_Serif_Display',serif] text-foreground mb-4">
              Your journey deserves a safe space.
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join Mynra — it's free, anonymous, and built around you.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-10 text-base font-semibold rounded-xl shadow-lg shadow-accent/20">
              Get Early Access <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <p className="text-xs text-muted-foreground mt-4">No real name required. No credit card.</p>
          </motion.div>
        </div>
      </Section>

      {/* ── 9. Footer ── */}
      <footer className="border-t border-border py-12 px-5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <MynraLogo size="sm" />
            <span className="font-bold text-primary font-['DM_Serif_Display',serif]">Mynra</span>
            <span className="text-xs text-muted-foreground ml-2">Peer support, reimagined.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Crisis Resources</a>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground/60 mt-8 max-w-md mx-auto">
          Mynra is not a substitute for professional mental health care.
        </p>
      </footer>
    </div>
  );
}
