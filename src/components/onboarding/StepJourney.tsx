import { OnboardingData, JourneyStage } from '@/pages/Onboarding';
import { Compass, Clock, CheckCircle, Heart } from 'lucide-react';

interface StepJourneyProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const journeyOptions: { value: JourneyStage; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'exploring',
    label: 'Exploring',
    description: "I'm beginning to understand my mental health",
    icon: <Compass className="w-6 h-6" />,
  },
  {
    value: 'awaiting_diagnosis',
    label: 'Awaiting Diagnosis',
    description: "I'm in the process of getting professional support",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    value: 'post_diagnosis',
    label: 'Post-Diagnosis',
    description: "I've received a diagnosis and am managing my journey",
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    value: 'supporting_others',
    label: 'Supporting Others',
    description: "I'm here to support friends, family, or peers",
    icon: <Heart className="w-6 h-6" />,
  },
];

export default function StepJourney({ data, setData }: StepJourneyProps) {
  const handleSelect = (stage: JourneyStage) => {
    setData(prev => ({ ...prev, journeyStage: stage }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-primary">
          Your Journey Stage
        </h2>
        <p className="text-muted-foreground">
          Where are you on your mental health journey? This helps us connect you with the right peers.
        </p>
      </div>

      <div className="space-y-3 mt-8">
        {journeyOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
              data.journeyStage === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-secondary'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              data.journeyStage === option.value
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              {option.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${
                data.journeyStage === option.value
                  ? 'text-primary'
                  : 'text-foreground'
              }`}>
                {option.label}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
