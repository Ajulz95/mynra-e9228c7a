import { OnboardingData } from '@/pages/Onboarding';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield } from 'lucide-react';

interface StepBoundariesProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const responseTimeOptions = [
  { value: 'whenever', label: 'Whenever works for me' },
  { value: 'within_hours', label: 'Within a few hours' },
  { value: 'within_day', label: 'Within a day' },
  { value: 'flexible', label: 'Flexible / No pressure' },
];

export default function StepBoundaries({ data, setData }: StepBoundariesProps) {
  const updateBoundary = <K extends keyof OnboardingData['boundaries']>(
    key: K,
    value: OnboardingData['boundaries'][K]
  ) => {
    setData(prev => ({
      ...prev,
      boundaries: {
        ...prev.boundaries,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-secondary" />
        </div>
        <h2 className="text-2xl font-semibold text-primary">
          Your Boundaries
        </h2>
        <p className="text-muted-foreground">
          Set your communication preferences. You can always change these later.
        </p>
      </div>

      <div className="space-y-6 mt-8">
        {/* DM Toggle */}
        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
          <div className="space-y-1">
            <Label htmlFor="dm" className="text-foreground font-medium">
              Direct Messages
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow others to message you directly
            </p>
          </div>
          <Switch
            id="dm"
            checked={data.boundaries.allowDirectMessages}
            onCheckedChange={(checked) => updateBoundary('allowDirectMessages', checked)}
          />
        </div>

        {/* Group Chats Toggle */}
        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
          <div className="space-y-1">
            <Label htmlFor="groups" className="text-foreground font-medium">
              Group Chats
            </Label>
            <p className="text-sm text-muted-foreground">
              Join group conversations with peers
            </p>
          </div>
          <Switch
            id="groups"
            checked={data.boundaries.allowGroupChats}
            onCheckedChange={(checked) => updateBoundary('allowGroupChats', checked)}
          />
        </div>

        {/* Response Time */}
        <div className="space-y-3">
          <Label className="text-foreground font-medium">
            Response Expectations
          </Label>
          <Select
            value={data.boundaries.preferredResponseTime}
            onValueChange={(value) => updateBoundary('preferredResponseTime', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              {responseTimeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Notes */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-foreground font-medium">
            Anything else peers should know? (Optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="E.g., I prefer text over voice, I may take time to respond during work hours..."
            value={data.boundaries.additionalNotes}
            onChange={(e) => updateBoundary('additionalNotes', e.target.value)}
            className="resize-none h-24"
          />
        </div>
      </div>
    </div>
  );
}
