import { OnboardingData } from '@/pages/Onboarding';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Sparkles } from 'lucide-react';

interface StepProfileProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

export default function StepProfile({ data, setData }: StepProfileProps) {
  const updateProfile = <K extends keyof OnboardingData['profile']>(
    key: K,
    value: OnboardingData['profile'][K]
  ) => {
    setData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
    }));
  };

  const generatePseudonym = () => {
    const adjectives = ['Calm', 'Bright', 'Gentle', 'Kind', 'Brave', 'Wise', 'Warm', 'Serene', 'Hopeful', 'Strong'];
    const nouns = ['Voyager', 'Dreamer', 'Seeker', 'Soul', 'Spirit', 'Heart', 'Mind', 'Wanderer', 'Explorer', 'Friend'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    updateProfile('pseudonym', `${adj}${noun}${num}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-semibold text-primary">
          Your Public Profile
        </h2>
        <p className="text-muted-foreground">
          Create your anonymous identity. Your real name stays private.
        </p>
      </div>

      <div className="space-y-6 mt-8">
        {/* Pseudonym */}
        <div className="space-y-3">
          <Label htmlFor="pseudonym" className="text-foreground font-medium">
            Choose Your Pseudonym
          </Label>
          <div className="flex gap-2">
            <Input
              id="pseudonym"
              placeholder="e.g., CalmVoyager42"
              value={data.profile.pseudonym}
              onChange={(e) => updateProfile('pseudonym', e.target.value)}
              maxLength={30}
              className="flex-1"
            />
            <button
              type="button"
              onClick={generatePseudonym}
              className="px-3 py-2 bg-secondary/20 hover:bg-secondary/30 rounded-lg transition-colors"
              title="Generate random pseudonym"
            >
              <Sparkles className="w-5 h-5 text-secondary" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            This is how you'll appear to other members (min 3 characters)
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-3">
          <Label htmlFor="bio" className="text-foreground font-medium">
            Short Bio (Optional)
          </Label>
          <Textarea
            id="bio"
            placeholder="Share a little about yourself or your journey. Keep it as brief or detailed as you like."
            value={data.profile.bio}
            onChange={(e) => updateProfile('bio', e.target.value)}
            maxLength={200}
            className="resize-none h-28"
          />
          <p className="text-xs text-muted-foreground text-right">
            {data.profile.bio.length}/200
          </p>
        </div>

        {/* Preview */}
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Preview of your public profile:
          </p>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">
                {data.profile.pseudonym || 'Your Pseudonym'}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {data.profile.bio || 'Your bio will appear here...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
