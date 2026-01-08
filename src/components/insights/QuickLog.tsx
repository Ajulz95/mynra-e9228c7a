import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Smile, Meh, Frown, Zap, Moon } from 'lucide-react';

interface QuickLogProps {
  onComplete: () => void;
}

const moodOptions = [
  { value: 1, icon: Frown, label: 'Struggling', color: 'text-red-400' },
  { value: 2, icon: Frown, label: 'Low', color: 'text-orange-400' },
  { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-400' },
  { value: 4, icon: Smile, label: 'Good', color: 'text-lime-400' },
  { value: 5, icon: Smile, label: 'Great', color: 'text-green-400' },
];

export default function QuickLog({ onComplete }: QuickLogProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleQuickSave = async () => {
    if (!user || !selectedMood) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: `Quick mood check-in: ${moodOptions.find(m => m.value === selectedMood)?.label}`,
          mood: selectedMood,
        });

      if (error) throw error;

      toast({
        title: 'Mood logged 💚',
        description: 'Great job checking in with yourself!',
      });

      setSelectedMood(null);
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

  return (
    <Card className="shadow-lg border-0 bg-card">
      <CardContent className="p-4">
        <p className="text-sm font-medium text-foreground mb-3">
          How are you feeling right now?
        </p>
        
        <div className="flex justify-between gap-1.5 mb-3">
          {moodOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedMood === option.value;
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
                onClick={() => setSelectedMood(option.value)}
                className={`flex-1 p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                  isSelected 
                    ? 'bg-gradient-to-b from-primary/20 to-primary/10 ring-2 ring-primary shadow-sm' 
                    : bgColors[option.value - 1]
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : option.color}`} />
                <span className={`text-xs ${isSelected ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {selectedMood && (
          <Button
            onClick={handleQuickSave}
            disabled={saving}
            size="sm"
            className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70"
          >
            {saving ? 'Saving...' : 'Log Mood'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
