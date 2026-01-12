import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Star, Calendar, Award, ArrowLeft } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DailyChallenges from '@/components/gamification/DailyChallenges';
import { motion } from 'framer-motion';

interface GamificationStats {
  total_points: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

interface WeeklyCompletion {
  date: string;
  count: number;
}

export default function SelfCare() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchWeeklyData();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_gamification_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setStats(data);
    }
    setLoading(false);
  };

  const fetchWeeklyData = async () => {
    if (!user) return;

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const { data, error } = await supabase
      .from('user_challenge_completions')
      .select('completed_date')
      .eq('user_id', user.id)
      .gte('completed_date', weekAgo.toISOString().split('T')[0])
      .lte('completed_date', today.toISOString().split('T')[0]);

    if (!error && data) {
      // Group by date
      const grouped = data.reduce((acc, item) => {
        const date = item.completed_date;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Create array for last 7 days
      const weekData: WeeklyCompletion[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        weekData.push({
          date: dateStr,
          count: grouped[dateStr] || 0,
        });
      }
      setWeeklyData(weekData);
    }
  };

  const getLevel = (points: number) => {
    if (points >= 500) return { level: 5, name: 'Self-Care Champion', nextLevel: null };
    if (points >= 300) return { level: 4, name: 'Wellness Warrior', nextLevel: 500 };
    if (points >= 150) return { level: 3, name: 'Mindful Explorer', nextLevel: 300 };
    if (points >= 50) return { level: 2, name: 'Growing Heart', nextLevel: 150 };
    return { level: 1, name: 'New Seedling', nextLevel: 50 };
  };

  const levelInfo = getLevel(stats?.total_points || 0);
  const progressToNext = levelInfo.nextLevel 
    ? ((stats?.total_points || 0) / levelInfo.nextLevel) * 100 
    : 100;

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/30 px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/activities')}
            className="mb-3 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Activities
          </Button>
          <h1 className="text-2xl font-bold mb-2">Self-Care Journey</h1>
          <p className="text-muted-foreground text-sm">
            Small steps, big impact. Track your daily wellness habits.
          </p>
        </motion.div>
      </div>

      <div className="px-4 -mt-4 max-w-md mx-auto space-y-4">
        {/* Level & Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-primary/20 text-primary border-0">
                      Level {levelInfo.level}
                    </Badge>
                    <span className="text-sm font-medium">{levelInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={progressToNext} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {stats?.total_points || 0}{levelInfo.nextLevel ? `/${levelInfo.nextLevel}` : ''} pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary mb-1">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold">{stats?.total_points || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-500 mb-1">
                    <Flame className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold">{stats?.current_streak || 0}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <Star className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold">{stats?.longest_streak || 0}</p>
                  <p className="text-xs text-muted-foreground">Best Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base">This Week</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-2">
                {weeklyData.map((day, index) => {
                  const dayDate = new Date(day.date);
                  const isToday = day.date === new Date().toISOString().split('T')[0];
                  const intensity = Math.min(day.count / 4, 1); // Max 4 challenges per day
                  
                  return (
                    <div key={day.date} className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {dayNames[dayDate.getDay()]}
                      </span>
                      <motion.div 
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                          isToday 
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                            : ''
                        }`}
                        style={{
                          backgroundColor: day.count > 0 
                            ? `hsl(var(--primary) / ${0.2 + intensity * 0.6})` 
                            : 'hsl(var(--muted))',
                          color: day.count > 0 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))'
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {day.count || '-'}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Challenges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DailyChallenges />
        </motion.div>

        {/* Motivation Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0">
            <CardContent className="py-4 text-center">
              <p className="text-sm italic text-muted-foreground">
                "Self-care is not self-indulgence, it is self-preservation."
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">— Audre Lorde</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
