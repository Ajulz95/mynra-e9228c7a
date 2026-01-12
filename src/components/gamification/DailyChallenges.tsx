import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Wind, Sun, Droplets, Heart, Flame, Trophy, Sparkles, CheckCircle2, Moon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
}

interface GamificationStats {
  total_points: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wind: Wind,
  sun: Sun,
  droplets: Droplets,
  heart: Heart,
};

export default function DailyChallenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (user) {
      fetchChallenges();
      fetchCompletedToday();
      fetchStats();
    }
  }, [user]);

  const fetchChallenges = async () => {
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('*')
      .eq('is_active', true);

    if (!error && data) {
      setChallenges(data);
    }
    setLoading(false);
  };

  const fetchCompletedToday = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('user_challenge_completions')
      .select('challenge_id')
      .eq('user_id', user.id)
      .eq('completed_date', today);

    if (!error && data) {
      setCompletedToday(new Set(data.map(c => c.challenge_id)));
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_gamification_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setStats(data);
      
      // Check if user has been away
      if (data.last_active_date) {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = new Date(data.last_active_date);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 1) {
          setShowWelcomeBack(true);
          setTimeout(() => setShowWelcomeBack(false), 5000);
        }
      }
    }
  };

  const handleChallengeComplete = async (challengeId: string, points: number) => {
    if (!user || completedToday.has(challengeId)) return;

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('user_challenge_completions')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        completed_date: today,
        points_earned: points,
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Already completed",
          description: "You've already done this challenge today!",
        });
      }
      return;
    }

    // Trigger celebration
    setCelebratingId(challengeId);
    setTimeout(() => setCelebratingId(null), 1500);

    setCompletedToday(prev => new Set([...prev, challengeId]));
    
    // Refresh stats
    await fetchStats();

    toast({
      title: "Well done! ✨",
      description: `You earned ${points} Self-Care Points!`,
    });
  };

  const completedCount = completedToday.size;
  const totalCount = challenges.length;
  const allCompleted = totalCount > 0 && completedCount >= totalCount;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-accent/30 to-accent/10 border-accent/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-accent/30 via-accent/20 to-primary/10 border-accent/30 overflow-hidden relative">
      {/* Celebration confetti overlay */}
      <AnimatePresence>
        {celebratingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  y: 0, 
                  x: `${Math.random() * 100}%`,
                  scale: 0.5 
                }}
                animate={{ 
                  opacity: 0, 
                  y: -100,
                  scale: 1,
                  rotate: Math.random() * 360 
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute bottom-0"
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-full">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg">Daily Self-Care</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            {stats && (
              <>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-0 gap-1">
                  <Trophy className="w-3 h-3" />
                  {stats.total_points} pts
                </Badge>
                {stats.current_streak > 0 && (
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 border-0 gap-1">
                    <Flame className="w-3 h-3" />
                    {stats.current_streak} day{stats.current_streak > 1 ? 's' : ''}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Welcome back message */}
        <AnimatePresence>
          {showWelcomeBack && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
                Welcome back! 💚 Your streak is waiting for you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Today's progress</span>
            <span className="font-medium">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {allCompleted && !dismissed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center"
            >
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              All done for today! 🎉
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              You've completed all your self-care tasks. Great job taking care of yourself!
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Moon className="w-4 h-4" />
              <span>New tasks unlock tomorrow</span>
            </div>
            {stats && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Today you earned <span className="font-semibold text-primary">{totalCount * 10} points</span>
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="mt-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </motion.div>
        ) : allCompleted && dismissed ? null : (
          <div className="space-y-2">
            {challenges.map((challenge) => {
              const Icon = iconMap[challenge.icon] || Heart;
              const isCompleted = completedToday.has(challenge.id);
              const isCelebrating = celebratingId === challenge.id;

              return (
                <motion.div
                  key={challenge.id}
                  animate={isCelebrating ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-primary/15 border border-primary/30' 
                      : 'bg-background/60 hover:bg-background/80 border border-transparent'
                  }`}
                  onClick={() => !isCompleted && handleChallengeComplete(challenge.id, challenge.points)}
                >
                  <div className={`p-2 rounded-full transition-colors ${
                    isCompleted ? 'bg-primary/30' : 'bg-muted'
                  }`}>
                    <Icon className={`w-4 h-4 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                      {challenge.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{challenge.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                      +{challenge.points}
                    </span>
                    <Checkbox 
                      checked={isCompleted}
                      className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
