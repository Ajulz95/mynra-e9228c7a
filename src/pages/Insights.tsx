import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, TrendingUp, Lock, Plus } from 'lucide-react';
import JournalList from '@/components/insights/JournalList';
import JournalEditor from '@/components/insights/JournalEditor';
import MoodTrends from '@/components/insights/MoodTrends';
import ThemeCloud from '@/components/insights/ThemeCloud';
import QuickLog from '@/components/insights/QuickLog';
import BottomNav from '@/components/BottomNav';

export interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: number | null;
  energy_level: number | null;
  anxiety_level: number | null;
  sleep_quality: number | null;
  tags: string[];
  created_at: string;
}

export default function Insights() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [activeTab, setActiveTab] = useState('journal');

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading entries',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [user]);

  const handleNewEntry = () => {
    setEditingEntry(null);
    setShowEditor(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowEditor(true);
  };

  const handleSaveEntry = async (entry: Partial<JournalEntry>) => {
    if (!user) return;

    try {
      if (editingEntry) {
        const { error } = await supabase
          .from('journal_entries')
          .update({
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            energy_level: entry.energy_level,
            anxiety_level: entry.anxiety_level,
            sleep_quality: entry.sleep_quality,
            tags: entry.tags,
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            energy_level: entry.energy_level,
            anxiety_level: entry.anxiety_level,
            sleep_quality: entry.sleep_quality,
            tags: entry.tags,
          });

        if (error) throw error;
      }

      toast({
        title: editingEntry ? 'Entry updated' : 'Entry saved',
        description: 'Your reflection has been safely stored.',
      });

      setShowEditor(false);
      loadEntries();
    } catch (error: any) {
      toast({
        title: 'Error saving entry',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      toast({ title: 'Entry deleted' });
      loadEntries();
    } catch (error: any) {
      toast({
        title: 'Error deleting entry',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading your sanctuary...</div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <JournalEditor
        entry={editingEntry}
        onSave={handleSaveEntry}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 safe-area-inset">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-white/70" />
            <span className="text-xs text-white/70">Private</span>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-1">Your Sanctuary</h1>
          <p className="text-white/80 text-sm">
            A safe space for reflection and self-discovery
          </p>
        </div>
      </div>

      {/* Quick Log */}
      <div className="px-4 -mt-4">
        <QuickLog onComplete={loadEntries} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-4 pb-24">
          <Button
            onClick={handleNewEntry}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Reflection
          </Button>

          <JournalList
            entries={entries}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 pb-24">
          <MoodTrends entries={entries} />
          <ThemeCloud entries={entries} />
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  );
}
