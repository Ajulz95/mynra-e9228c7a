import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Smile, Meh, Frown } from 'lucide-react';
import { startOfDay, endOfDay } from 'date-fns';

interface QuickLogProps {
  onComplete: () => void;
}

const moodOptions = [
  { value: 1, icon: Frown, label: 'Sad', emoji: '😢', color: 'text-red-400' },
  { value: 2, icon: Frown, label: 'Low', emoji: '😔', color: 'text-orange-400' },
  { value: 3, icon: Meh, label: 'Okay', emoji: '😐', color: 'text-yellow-400' },
  { value: 4, icon: Smile, label: 'Good', emoji: '🙂', color: 'text-lime-400' },
  { value: 5, icon: Smile, label: 'Great', emoji: '😊', color: 'text-green-400' },
];

export default function QuickLog({ onComplete }: QuickLogProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [todayMoodLogId, setTodayMoodLogId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load today's mood on mount (synced with Home page)
  useEffect(() => {
    const loadTodayMood = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const today = new Date();
      const dayStart = startOfDay(today).toISOString();
      const dayEnd = endOfDay(today).toISOString();

      const { data } = await supabase
        .from('symptom_logs')
        .select('id, intensity')
        .eq('user_id', user.id)
        .eq('symptom', 'daily_mood')
        .gte('logged_at', dayStart)
        .lte('logged_at', dayEnd)
        .order('logged_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setSelectedMood(data.intensity);
        setTodayMoodLogId(data.id);
      }
      setLoading(false);
    };

    loadTodayMood();
  }, [user]);

  const handleMoodSelect = async (moodValue: number) => {
    if (!user) return;

    setSelectedMood(moodValue);
    setSaving(true);

    try {
      if (todayMoodLogId) {
        // Update existing log
        await supabase
          .from('symptom_logs')
          .update({ intensity: moodValue })
          .eq('id', todayMoodLogId);
      } else {
        // Create new log
        const { data } = await supabase
          .from('symptom_logs')
          .insert({
            user_id: user.id,
            symptom: 'daily_mood',
            intensity: moodValue,
          })
          .select('id')
          .single();

        if (data) {
          setTodayMoodLogId(data.id);
        }
      }

      const moodLabel = moodOptions.find(m => m.value === moodValue)?.label;
      toast({
        title: 'Mood logged 💚',
        description: `Feeling ${moodLabel?.toLowerCase()} is okay. We're here for you.`,
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error saving',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangeMood = () => {
    setSelectedMood(null);
  };

  const currentMood = moodOptions.find(m => m.value === selectedMood);

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-card">
        <CardContent className="p-4">
          <div className="h-20 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-card">
      <CardContent className="p-4">
        {selectedMood && currentMood ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-3xl">{currentMood.emoji}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Emotion</p>
                <p className="font-bold text-foreground">{currentMood.label}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-accent font-semibold text-sm"
              onClick={handleChangeMood}
              disabled={saving}
            >
              Change
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground mb-3">
              How are you feeling right now?
            </p>
            
            <div className="flex justify-between gap-1.5">
              {moodOptions.map((option, index) => {
                const bgColors = [
                  'bg-destructive/10 hover:bg-destructive/20',
                  'bg-accent/15 hover:bg-accent/25', 
                  'bg-accent/10 hover:bg-accent/20',
                  'bg-secondary/15 hover:bg-secondary/25',
                  'bg-secondary/20 hover:bg-secondary/30'
                ];
                return (
                  <button
                    key={option.value}
                    onClick={() => handleMoodSelect(option.value)}
                    disabled={saving}
                    className={`flex-1 p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${bgColors[index]} disabled:opacity-50`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
