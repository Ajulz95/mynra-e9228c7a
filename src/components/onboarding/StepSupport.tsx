import { OnboardingData, SupportPreference } from '@/pages/Onboarding';
import { MessageCircle, Lightbulb, Users, BookOpen, Check } from 'lucide-react';

interface StepSupportProps {
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}

const supportOptions: { value: SupportPreference; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'just_chatting',
    label: 'Just Chatting',
    description: 'Casual conversations with peers who understand',
    icon: <MessageCircle className="w-6 h-6" />,
  },
  {
    value: 'guided_insights',
    label: 'Guided Insights',
    description: 'Structured prompts and reflective exercises',
    icon: <Lightbulb className="w-6 h-6" />,
  },
  {
    value: 'peer_support',
    label: 'Peer Support',
    description: 'Connect with others on similar journeys',
    icon: <Users className="w-6 h-6" />,
  },
  {
    value: 'professional_resources',
    label: 'Professional Resources',
    description: 'Access to curated mental health resources',
    icon: <BookOpen className="w-6 h-6" />,
  },
];

export default function StepSupport({ data, setData }: StepSupportProps) {
  const handleToggle = (preference: SupportPreference) => {
    setData(prev => ({
      ...prev,
      supportPreferences: prev.supportPreferences.includes(preference)
        ? prev.supportPreferences.filter(p => p !== preference)
        : [...prev.supportPreferences, preference],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-primary">
          How Can We Support You?
        </h2>
        <p className="text-muted-foreground">
          Choose what kind of support feels right for you. Select all that apply.
        </p>
      </div>

      <div className="space-y-3 mt-8">
        {supportOptions.map((option) => {
          const isSelected = data.supportPreferences.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 relative ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-secondary'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`p-2 rounded-lg ${
                isSelected
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {option.icon}
              </div>
              <div className="flex-1 pr-8">
                <h3 className={`font-medium ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}>
                  {option.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Selected: {data.supportPreferences.length} {data.supportPreferences.length === 1 ? 'option' : 'options'}
      </p>
    </div>
  );
}
