import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type JourneyStage = Database['public']['Enums']['journey_stage'];
type SupportPreference = Database['public']['Enums']['support_preference'];

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentData: {
    firstName: string | null;
    pseudonym: string;
    bio: string | null;
    journeyStage: string | null;
    challenges: string[];
    supportPreferences: string[];
  };
  onSave: () => void;
}

const challengeOptions = [
  { id: 'depression', label: 'Depression', emoji: '😔' },
  { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { id: 'adhd', label: 'ADHD', emoji: '⚡' },
  { id: 'grief', label: 'Grief', emoji: '🕊️' },
  { id: 'ptsd', label: 'PTSD', emoji: '💔' },
];

const supportOptions: { id: SupportPreference; label: string }[] = [
  { id: 'just_chatting', label: 'Just Chatting' },
  { id: 'guided_insights', label: 'Guided Insights' },
  { id: 'peer_support', label: 'Peer Support' },
  { id: 'professional_resources', label: 'Professional Resources' },
];

const journeyOptions: { id: JourneyStage; label: string }[] = [
  { id: 'exploring', label: 'Exploring' },
  { id: 'awaiting_diagnosis', label: 'Awaiting Diagnosis' },
  { id: 'post_diagnosis', label: 'Post-Diagnosis' },
  { id: 'supporting_others', label: 'Supporting Others' },
];

export default function EditProfileModal({
  open,
  onOpenChange,
  userId,
  currentData,
  onSave,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(currentData.firstName || '');
  const [pseudonym, setPseudonym] = useState(currentData.pseudonym);
  const [bio, setBio] = useState(currentData.bio || '');
  const [journeyStage, setJourneyStage] = useState<string | null>(currentData.journeyStage);
  const [challenges, setChallenges] = useState<string[]>(currentData.challenges);
  const [supportPreferences, setSupportPreferences] = useState<string[]>(currentData.supportPreferences);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setFirstName(currentData.firstName || '');
      setPseudonym(currentData.pseudonym);
      setBio(currentData.bio || '');
      setJourneyStage(currentData.journeyStage);
      setChallenges(currentData.challenges);
      setSupportPreferences(currentData.supportPreferences);
    }
  }, [open, currentData]);

  const generatePseudonym = () => {
    const adjectives = ['Calm', 'Bright', 'Gentle', 'Kind', 'Brave', 'Wise', 'Warm', 'Serene', 'Hopeful', 'Strong'];
    const nouns = ['Voyager', 'Dreamer', 'Seeker', 'Soul', 'Spirit', 'Heart', 'Mind', 'Wanderer', 'Explorer', 'Friend'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    setPseudonym(`${adj}${noun}${num}`);
  };

  const toggleChallenge = (id: string) => {
    setChallenges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleSupport = (id: string) => {
    setSupportPreferences(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (pseudonym.trim().length < 3) {
      toast({
        title: 'Invalid pseudonym',
        description: 'Pseudonym must be at least 3 characters',
        variant: 'destructive',
      });
      return;
    }

    if (challenges.length === 0) {
      toast({
        title: 'Select at least one challenge',
        description: 'Please select what you relate to',
        variant: 'destructive',
      });
      return;
    }

    if (supportPreferences.length === 0) {
      toast({
        title: 'Select at least one preference',
        description: 'Please select what you\'re looking for',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim() || null,
          pseudonym: pseudonym.trim(),
          bio: bio.trim() || null,
        })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      // Update journey stage
      if (journeyStage) {
        const { error: journeyError } = await supabase
          .from('user_journey_stages')
          .update({ stage: journeyStage as JourneyStage })
          .eq('user_id', userId);

        if (journeyError) throw journeyError;
      }

      // Update challenges - delete existing and insert new
      await supabase
        .from('user_challenges')
        .delete()
        .eq('user_id', userId);

      if (challenges.length > 0) {
        const { error: challengesError } = await supabase
          .from('user_challenges')
          .insert(challenges.map(challenge => ({ user_id: userId, challenge })));

        if (challengesError) throw challengesError;
      }

      // Update support preferences - delete existing and insert new
      await supabase
        .from('user_support_preferences')
        .delete()
        .eq('user_id', userId);

      if (supportPreferences.length > 0) {
        const { error: prefsError } = await supabase
          .from('user_support_preferences')
          .insert(supportPreferences.map(preference => ({
            user_id: userId,
            preference: preference as SupportPreference,
          })));

        if (prefsError) throw prefsError;
      }

      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved',
      });

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error saving profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name (Private)</Label>
            <Input
              id="firstName"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              Only visible to you
            </p>
          </div>

          {/* Pseudonym */}
          <div className="space-y-2">
            <Label htmlFor="pseudonym">Pseudonym (Public)</Label>
            <div className="flex gap-2">
              <Input
                id="pseudonym"
                placeholder="e.g., CalmVoyager42"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                maxLength={30}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={generatePseudonym}
                title="Generate random"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About Me (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Share a little about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              className="resize-none h-20"
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/200
            </p>
          </div>

          {/* Journey Stage */}
          <div className="space-y-2">
            <Label>Journey Stage</Label>
            <div className="flex flex-wrap gap-2">
              {journeyOptions.map((option) => (
                <Badge
                  key={option.id}
                  variant={journeyStage === option.id ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    journeyStage === option.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setJourneyStage(option.id)}
                >
                  {journeyStage === option.id && <Check className="w-3 h-3 mr-1" />}
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="space-y-2">
            <Label>What I Relate To</Label>
            <div className="flex flex-wrap gap-2">
              {challengeOptions.map((option) => (
                <Badge
                  key={option.id}
                  variant={challenges.includes(option.id) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    challenges.includes(option.id)
                      ? 'bg-secondary text-secondary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleChallenge(option.id)}
                >
                  <span className="mr-1">{option.emoji}</span>
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Support Preferences */}
          <div className="space-y-2">
            <Label>Looking For</Label>
            <div className="flex flex-wrap gap-2">
              {supportOptions.map((option) => (
                <Badge
                  key={option.id}
                  variant={supportPreferences.includes(option.id) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    supportPreferences.includes(option.id)
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => toggleSupport(option.id)}
                >
                  {supportPreferences.includes(option.id) && <Check className="w-3 h-3 mr-1" />}
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
