import { useState } from 'react';
import { JournalEntry } from '@/pages/Insights';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Smile, Meh, Frown, Zap, Moon, X } from 'lucide-react';

interface JournalEditorProps {
  entry: JournalEntry | null;
  onSave: (entry: Partial<JournalEntry>) => void;
  onCancel: () => void;
}

const moodOptions = [
  { value: 1, icon: Frown, label: 'Very Low' },
  { value: 2, icon: Frown, label: 'Low' },
  { value: 3, icon: Meh, label: 'Neutral' },
  { value: 4, icon: Smile, label: 'Good' },
  { value: 5, icon: Smile, label: 'Great' },
];

const commonTags = [
  'anxiety', 'depression', 'progress', 'therapy', 'medication',
  'sleep', 'exercise', 'social', 'work', 'family', 'gratitude', 'trigger'
];

export default function JournalEditor({ entry, onSave, onCancel }: JournalEditorProps) {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<number | null>(entry?.mood || null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(entry?.energy_level || null);
  const [anxietyLevel, setAnxietyLevel] = useState<number | null>(entry?.anxiety_level || null);
  const [sleepQuality, setSleepQuality] = useState<number | null>(entry?.sleep_quality || null);
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await onSave({
      title: title || null,
      content,
      mood,
      energy_level: energyLevel,
      anxiety_level: anxietyLevel,
      sleep_quality: sleepQuality,
      tags,
    });
    setSaving(false);
  };

  const renderScale = (
    label: string,
    value: number | null,
    onChange: (v: number) => void,
    lowLabel: string,
    highLabel: string,
    icon: React.ReactNode
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground w-12">{lowLabel}</span>
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => onChange(v)}
              className={`flex-1 h-8 rounded-lg transition-all ${
                value === v 
                  ? 'bg-primary text-white' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground w-12 text-right">{highLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={onCancel}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">
            {entry ? 'Edit Entry' : 'New Reflection'}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={handleSave}
            disabled={!content.trim() || saving}
          >
            <Save className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-6 pb-24">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title (optional)</Label>
          <Input
            id="title"
            placeholder="Give this entry a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Mood */}
        <div className="space-y-2">
          <Label>How's your mood?</Label>
          <div className="flex gap-2">
            {moodOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = mood === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={`flex-1 p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                    isSelected 
                      ? 'bg-primary text-white' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scales */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
          {renderScale('Energy', energyLevel, setEnergyLevel, 'Low', 'High', <Zap className="w-4 h-4 text-yellow-500" />)}
          {renderScale('Anxiety', anxietyLevel, setAnxietyLevel, 'Calm', 'High', <Meh className="w-4 h-4 text-orange-500" />)}
          {renderScale('Sleep Quality', sleepQuality, setSleepQuality, 'Poor', 'Great', <Moon className="w-4 h-4 text-indigo-500" />)}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Your thoughts</Label>
          <Textarea
            id="content"
            placeholder="What's on your mind? Write freely - this is your private space..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags (optional)</Label>
          <div className="flex flex-wrap gap-2">
            {commonTags.map((tag) => (
              <Badge
                key={tag}
                variant={tags.includes(tag) ? 'default' : 'outline'}
                className={`cursor-pointer ${
                  tags.includes(tag) ? 'bg-secondary' : ''
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-area-inset">
        <Button
          onClick={handleSave}
          disabled={!content.trim() || saving}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {saving ? 'Saving...' : 'Save Reflection'}
        </Button>
      </div>
    </div>
  );
}
