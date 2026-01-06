import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Phone, TrendingUp, PenLine } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

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
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleMoodSelect = (mood: typeof moodEmojis[0]) => {
    toast.success("Thank you for sharing", {
      description: `Feeling ${mood.label.toLowerCase()} is okay. We're here for you.`,
    });
  };

  const handleSaveReflection = () => {
    if (reflection.trim()) {
      toast.success("Reflection saved");
      setReflection("");
      setShowReflection(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Section */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, {displayName}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">How are you feeling today?</p>
      </div>

      {/* Daily Check-in */}
      <div className="px-5 pb-6">
        <Card className="border-0 shadow-sm bg-card">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">Daily Check-in</p>
            <div className="flex justify-between">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-muted-foreground">{mood.label}</span>
                </button>
              ))}
            </div>
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
              onClick={() => navigate("/discover")}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full ${peer.avatarColor} mb-2`} />
                  <p className="font-medium text-foreground text-sm truncate w-full">
                    {peer.pseudonym}
                  </p>
                  <p className="text-xs text-secondary font-semibold mt-1">
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
            
            {/* Mood Trend Placeholder */}
            <div className="h-20 bg-muted/30 rounded-lg flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Weekly mood trend</span>
              </div>
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
