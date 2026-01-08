import { OnboardingData } from '@/pages/Onboarding';
import { Check } from 'lucide-react';

interface StepChallengesProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const challengeOptions = [
  { value: 'depression', label: 'Depression', emoji: '😔' },
  { value: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { value: 'adhd', label: 'ADHD', emoji: '⚡' },
  { value: 'grief', label: 'Grief & Loss', emoji: '🕊️' },
  { value: 'ptsd', label: 'PTSD / Trauma', emoji: '💔' },
];

export default function StepChallenges({ data, setData }: StepChallengesProps) {
  const handleToggle = (challenge: string) => {
    setData(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-primary">
          What Resonates With You?
        </h2>
        <p className="text-muted-foreground">
          Select the themes or challenges you relate to. This helps match you with peers who understand.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        {challengeOptions.map((option) => {
          const isSelected = data.challenges.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={`p-3 rounded-xl border-2 transition-all text-left relative ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-secondary'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-2xl">{option.emoji}</span>
              <p className={`text-sm font-medium mt-1 ${
                isSelected ? 'text-primary' : 'text-foreground'
              }`}>
                {option.label}
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Selected: {data.challenges.length} {data.challenges.length === 1 ? 'theme' : 'themes'}
      </p>
    </div>
  );
}
