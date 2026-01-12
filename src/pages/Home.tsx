import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Phone, TrendingUp, TrendingDown, Minus, PenLine, Bell, Settings } from "lucide-react";
import { toast } from "sonner";
import { startOfDay, endOfDay, subDays, format, eachDayOfInterval } from "date-fns";
import BottomNav from "@/components/BottomNav";
import DailyChallenges from "@/components/gamification/DailyChallenges";

const moodEmojis = [
  { emoji: "😢", label: "Sad", value: 1 },
  { emoji: "😔", label: "Low", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
];

const suggestedPeers = [
  {
    id: "1",
    pseudonym: "Calm Lotus",
    matchScore: 92,
    tags: ["Anxiety", "Mindfulness", "Creative"],
    avatarColor: "bg-secondary",
  },
  {
    id: "2",
    pseudonym: "Quiet Storm",
    matchScore: 87,
    tags: ["Depression", "Journaling", "Nature"],
    avatarColor: "bg-primary/60",
  },
  {
    id: "3",
    pseudonym: "Gentle Wave",
    matchScore: 85,
    tags: ["ADHD", "Meditation", "Art"],
    avatarColor: "bg-accent/70",
  },
  {
    id: "4",
    pseudonym: "Soft Cloud",
    matchScore: 81,
    tags: ["Stress", "Yoga", "Reading"],
    avatarColor: "bg-muted-foreground/40",
  },
];

const recentMessages = [
  {
    id: "1",
    name: "Peaceful River",
    snippet: "Thank you for sharing that with me...",
    time: "2h ago",
  },
  {
    id: "2",
    name: "Bright Star",
    snippet: "I completely understand what you mean.",
    time: "5h ago",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState("");
  const [displayName, setDisplayName] = useState("there");
  const [selectedMood, setSelectedMood] = useState<typeof moodEmojis[0] | null>(null);
  const [todayMoodLogId, setTodayMoodLogId] = useState<string | null>(null);
  const [weeklyMoods, setWeeklyMoods] = useState<{ date: string; mood: number | null }[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("first_name, pseudonym")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setDisplayName(data.first_name || data.pseudonym || "there");
      }
    };
    fetchProfile();
  }, [user]);

  // Load today's mood on mount
  useEffect(() => {
    const loadTodayMood = async () => {
      if (!user) return;

      const today = new Date();
      const dayStart = startOfDay(today).toISOString();
      const dayEnd = endOfDay(today).toISOString();

      const { data } = await supabase
        .from("symptom_logs")
        .select("id, intensity")
        .eq("user_id", user.id)
        .eq("symptom", "daily_mood")
        .gte("logged_at", dayStart)
        .lte("logged_at", dayEnd)
        .order("logged_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        const mood = moodEmojis.find(m => m.value === data.intensity);
        if (mood) {
          setSelectedMood(mood);
          setTodayMoodLogId(data.id);
        }
      }
    };

    loadTodayMood();
  }, [user]);

  // Load weekly mood data
  useEffect(() => {
    const loadWeeklyMoods = async () => {
      if (!user) return;

      const weekStart = subDays(new Date(), 6);
      const today = new Date();

      const { data } = await supabase
        .from("symptom_logs")
        .select("intensity, logged_at")
        .eq("user_id", user.id)
        .eq("symptom", "daily_mood")
        .gte("logged_at", startOfDay(weekStart).toISOString())
        .lte("logged_at", endOfDay(today).toISOString())
        .order("logged_at", { ascending: true });

      const last7Days = eachDayOfInterval({ start: weekStart, end: today });
      
      const dailyMoods = last7Days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayLogs = data?.filter(log => 
          format(new Date(log.logged_at), 'yyyy-MM-dd') === dayStr
        ) || [];
        
        const avgMood = dayLogs.length > 0
          ? dayLogs.reduce((sum, log) => sum + (log.intensity || 0), 0) / dayLogs.length
          : null;

        return {
          date: format(day, 'EEE'),
          mood: avgMood,
        };
      });

      setWeeklyMoods(dailyMoods);
    };

    loadWeeklyMoods();
  }, [user, selectedMood]);

  const { trend, averageMood } = useMemo(() => {
    const moodsWithData = weeklyMoods.filter(d => d.mood !== null);
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    
    if (moodsWithData.length >= 2) {
      const recentHalf = moodsWithData.slice(-Math.ceil(moodsWithData.length / 2));
      const olderHalf = moodsWithData.slice(0, Math.floor(moodsWithData.length / 2));
      
      if (recentHalf.length > 0 && olderHalf.length > 0) {
        const recentAvg = recentHalf.reduce((s, d) => s + (d.mood || 0), 0) / recentHalf.length;
        const olderAvg = olderHalf.reduce((s, d) => s + (d.mood || 0), 0) / olderHalf.length;
        
        if (recentAvg - olderAvg > 0.3) trendDirection = 'up';
        else if (olderAvg - recentAvg > 0.3) trendDirection = 'down';
      }
    }

    const allMoods = weeklyMoods.filter(d => d.mood !== null).map(d => d.mood!);
    const avg = allMoods.length > 0 
      ? allMoods.reduce((s, m) => s + m, 0) / allMoods.length 
      : 0;

    return { trend: trendDirection, averageMood: avg };
  }, [weeklyMoods]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleMoodSelect = async (mood: typeof moodEmojis[0]) => {
    if (!user) return;

    setSelectedMood(mood);

    try {
      if (todayMoodLogId) {
        // Update existing log
        await supabase
          .from("symptom_logs")
          .update({ intensity: mood.value })
          .eq("id", todayMoodLogId);
      } else {
        // Create new log
        const { data } = await supabase
          .from("symptom_logs")
          .insert({
            user_id: user.id,
            symptom: "daily_mood",
            intensity: mood.value,
          })
          .select("id")
          .single();

        if (data) {
          setTodayMoodLogId(data.id);
        }
      }

      toast.success("Thank you for sharing", {
        description: `Feeling ${mood.label.toLowerCase()} is okay. We're here for you.`,
      });
    } catch (error) {
      console.error("Error saving mood:", error);
      toast.error("Failed to save mood");
    }
  };

  const handleChangeMood = () => {
    setSelectedMood(null);
  };

  const handleSaveReflection = () => {
    if (reflection.trim()) {
      toast.success("Reflection saved");
      setReflection("");
      setShowReflection(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 animate-fade-in">
      {/* Top Icons */}
      <div className="flex items-center justify-end gap-2 px-5 pt-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/profile")}
        >
          <Bell className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/profile")}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Header Section */}
      <div className="px-5 pb-4">
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {displayName}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">How are you feeling today?</p>
      </div>

      {/* Daily Check-in */}
      <div className="px-5 pb-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-secondary/10">
          <CardContent className="py-4">
            {selectedMood ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-3xl">{selectedMood.emoji}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Emotion</p>
                    <p className="font-bold text-foreground">{selectedMood.label}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-accent font-semibold text-sm"
                  onClick={handleChangeMood}
                >
                  Change
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-muted-foreground mb-3">Daily Check-in</p>
                <div className="flex justify-between">
                  {moodEmojis.map((mood, index) => (
                    <button
                      key={mood.value}
                      onClick={() => handleMoodSelect(mood)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:scale-105 transition-all ${
                        index === 4 ? 'hover:bg-secondary/30' : 
                        index === 3 ? 'hover:bg-secondary/20' :
                        index === 2 ? 'hover:bg-accent/20' :
                        index === 1 ? 'hover:bg-accent/30' :
                        'hover:bg-destructive/10'
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs text-muted-foreground">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suggested Peers - Horizontal Scroll */}
      <div className="pb-6">
        <div className="px-5 flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Suggested Peers</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary text-sm"
            onClick={() => navigate("/discover")}
          >
            See all
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {suggestedPeers.map((peer) => (
            <Card
              key={peer.id}
              className="flex-shrink-0 w-40 border-0 shadow-sm bg-card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/profile/${peer.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full ${peer.avatarColor} mb-2`} />
                  <p className="font-medium text-foreground text-sm truncate w-full">
                    {peer.pseudonym}
                  </p>
                  <p className="text-xs text-accent font-semibold mt-1">
                    {peer.matchScore}% Match
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {peer.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Self-Care Challenges */}
      <div className="px-5 pb-6">
        <DailyChallenges />
      </div>

      {/* Your Journey - Insights Widget */}
      <div className="px-5 pb-6">
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Your Journey</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary text-sm"
                onClick={() => navigate("/insights")}
              >
                View all
              </Button>
            </div>
            
            {/* Weekly Mood Trend */}
            <div className="mb-4">
              {weeklyMoods.some(d => d.mood !== null) ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This week</span>
                    <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                      trend === 'up' ? 'bg-secondary/30 text-primary' :
                      trend === 'down' ? 'bg-accent/20 text-accent' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {trend === 'stable' && <Minus className="w-3 h-3" />}
                      <span className="capitalize">{trend}</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-1 h-16">
                    {weeklyMoods.map((day, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div className="flex-1 w-full flex items-end justify-center">
                          {day.mood !== null ? (
                            <div 
                              className={`w-3 rounded-t-sm ${
                                day.mood >= 4 ? 'bg-secondary' :
                                day.mood >= 3 ? 'bg-accent' :
                                'bg-accent/60'
                              }`}
                              style={{ height: `${(day.mood / 5) * 100}%`, minHeight: '4px' }}
                            />
                          ) : (
                            <div className="w-3 h-1 rounded-full bg-muted" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1">{day.date}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">
                      Avg: {averageMood > 0 ? averageMood.toFixed(1) : '-'}/5
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-20 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <span className="text-sm">Log moods to see trends</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Reflection */}
            {showReflection ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="What's on your mind..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="resize-none border-muted"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReflection(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveReflection}
                    className="flex-1 bg-primary"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5"
                onClick={() => setShowReflection(true)}
              >
                <PenLine className="w-4 h-4 mr-2" />
                Quick Reflection
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <div className="px-5 pb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Messages</h2>
        <div className="space-y-2">
          {recentMessages.map((message) => (
            <Card
              key={message.id}
              className="border-0 shadow-sm bg-card cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground text-sm">{message.name}</p>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.snippet}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Lock className="w-4 h-4 text-muted-foreground/60" />
                    <Phone className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
