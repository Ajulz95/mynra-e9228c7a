import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StepJourney from '@/components/onboarding/StepJourney';
import StepChallenges from '@/components/onboarding/StepChallenges';
import StepSupport from '@/components/onboarding/StepSupport';
import StepBoundaries from '@/components/onboarding/StepBoundaries';
import StepProfile from '@/components/onboarding/StepProfile';

export type JourneyStage = 'exploring' | 'awaiting_diagnosis' | 'post_diagnosis' | 'supporting_others';
export type SupportPreference = 'just_chatting' | 'guided_insights' | 'peer_support' | 'professional_resources';

export interface OnboardingData {
  journeyStage: JourneyStage | null;
  challenges: string[];
  supportPreferences: SupportPreference[];
  boundaries: {
    allowDirectMessages: boolean;
    allowGroupChats: boolean;
    preferredResponseTime: string;
    topicsToAvoid: string[];
    additionalNotes: string;
  };
  profile: {
    pseudonym: string;
    bio: string;
  };
}

const TOTAL_STEPS = 5;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    journeyStage: null,
    challenges: [],
    supportPreferences: [],
    boundaries: {
      allowDirectMessages: true,
      allowGroupChats: true,
      preferredResponseTime: 'whenever',
      topicsToAvoid: [],
      additionalNotes: '',
    },
    profile: {
      pseudonym: '',
      bio: '',
    },
  });

  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Load existing profile data
    const loadProfile = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('pseudonym, onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        navigate('/profile');
        return;
      }

      if (profile?.pseudonym) {
        setData(prev => ({
          ...prev,
          profile: { ...prev.profile, pseudonym: profile.pseudonym }
        }));
      }
    };

    loadProfile();
  }, [user, navigate]);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.journeyStage !== null;
      case 2:
        return data.challenges.length > 0;
      case 3:
        return data.supportPreferences.length > 0;
      case 4:
        return true; // Boundaries have defaults
      case 5:
        return data.profile.pseudonym.trim().length >= 3;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Save journey stage
      const { error: journeyError } = await supabase
        .from('user_journey_stages')
        .upsert({
          user_id: user.id,
          stage: data.journeyStage,
        }, { onConflict: 'user_id' });

      if (journeyError) throw journeyError;

      // Save challenges
      await supabase
        .from('user_challenges')
        .delete()
        .eq('user_id', user.id);

      if (data.challenges.length > 0) {
        const { error: challengesError } = await supabase
          .from('user_challenges')
          .insert(
            data.challenges.map(challenge => ({
              user_id: user.id,
              challenge,
            }))
          );

        if (challengesError) throw challengesError;
      }

      // Save support preferences
      await supabase
        .from('user_support_preferences')
        .delete()
        .eq('user_id', user.id);

      if (data.supportPreferences.length > 0) {
        const { error: prefsError } = await supabase
          .from('user_support_preferences')
          .insert(
            data.supportPreferences.map(preference => ({
              user_id: user.id,
              preference,
            }))
          );

        if (prefsError) throw prefsError;
      }

      // Save boundaries
      const { error: boundariesError } = await supabase
        .from('user_boundaries')
        .upsert({
          user_id: user.id,
          allow_direct_messages: data.boundaries.allowDirectMessages,
          allow_group_chats: data.boundaries.allowGroupChats,
          preferred_response_time: data.boundaries.preferredResponseTime,
          topics_to_avoid: data.boundaries.topicsToAvoid,
          additional_notes: data.boundaries.additionalNotes,
        }, { onConflict: 'user_id' });

      if (boundariesError) throw boundariesError;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          pseudonym: data.profile.pseudonym,
          bio: data.profile.bio,
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast({
        title: 'Profile Created!',
        description: 'Your journey with Vestra begins now.',
      });

      navigate('/profile');
    } catch (error: any) {
      toast({
        title: 'Error saving profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepJourney data={data} setData={setData} />;
      case 2:
        return <StepChallenges data={data} setData={setData} />;
      case 3:
        return <StepSupport data={data} setData={setData} />;
      case 4:
        return <StepBoundaries data={data} setData={setData} />;
      case 5:
        return <StepProfile data={data} setData={setData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-border bg-background">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {currentStep < TOTAL_STEPS ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed() || isLoading}
              className="flex-1 bg-accent hover:bg-accent/90 text-white"
            >
              {isLoading ? 'Saving...' : 'Complete'}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
