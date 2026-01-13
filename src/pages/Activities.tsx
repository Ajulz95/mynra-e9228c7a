import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ChevronRight, Flame, Trophy, Target, Sparkles, Brain, Wind, BookHeart, Clock, Lightbulb, Smile, Feather, Star, Leaf, Sun } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const selfCareFeatures = [
  { icon: Target, title: 'Daily Challenges', description: 'Simple wellness tasks to complete each day' },
  { icon: Flame, title: 'Streak Tracking', description: 'Build healthy habits with daily streaks' },
  { icon: Trophy, title: 'Earn Points', description: 'Gain self-care points for completing tasks' },
  { icon: Sparkles, title: 'Celebrate Progress', description: 'Watch your wellness journey grow' },
];

const breathingFeatures = [
  { icon: Wind, title: 'Guided Sessions', description: 'Follow along with calming breathing patterns' },
  { icon: Clock, title: 'Timed Exercises', description: 'Sessions from 1 to 10 minutes' },
  { icon: Leaf, title: 'Reduce Stress', description: 'Lower anxiety with proven techniques' },
  { icon: Sun, title: 'Daily Practice', description: 'Build a consistent mindfulness habit' },
];

const gratitudeFeatures = [
  { icon: BookHeart, title: 'Daily Prompts', description: 'Thoughtful questions to inspire reflection' },
  { icon: Star, title: 'Save Moments', description: 'Build a collection of positive memories' },
  { icon: Smile, title: 'Boost Mood', description: 'Shift focus to what matters most' },
  { icon: Feather, title: 'Easy Entries', description: 'Quick and simple journaling experience' },
];

const affirmationFeatures = [
  { icon: Lightbulb, title: 'Daily Affirmations', description: 'Positive statements to start your day' },
  { icon: Brain, title: 'Rewire Thinking', description: 'Build healthier thought patterns' },
  { icon: Sparkles, title: 'Personalized', description: 'Affirmations tailored to your journey' },
  { icon: Heart, title: 'Self-Compassion', description: 'Nurture kindness towards yourself' },
];

export default function Activities() {
  const navigate = useNavigate();

  const handleComingSoon = (activityName: string) => {
    toast.info(`${activityName} coming soon!`);
  };

  const activities = [
    {
      icon: Heart,
      title: 'Daily Self-Care',
      description: 'Complete daily wellness challenges and track your progress',
      features: selfCareFeatures,
      cta: 'Start Today\'s Challenges',
      onClick: () => navigate('/activities/self-care'),
    },
    {
      icon: Wind,
      title: 'Breathing Exercises',
      description: 'Calm your mind with guided breathing techniques',
      features: breathingFeatures,
      cta: 'Start Breathing',
      onClick: () => handleComingSoon('Breathing Exercises'),
    },
    {
      icon: BookHeart,
      title: 'Gratitude Journal',
      description: 'Cultivate positivity by reflecting on what you\'re thankful for',
      features: gratitudeFeatures,
      cta: 'Write Entry',
      onClick: () => handleComingSoon('Gratitude Journal'),
    },
    {
      icon: Lightbulb,
      title: 'Daily Affirmations',
      description: 'Empower yourself with positive self-talk and encouragement',
      features: affirmationFeatures,
      cta: 'Get Inspired',
      onClick: () => handleComingSoon('Daily Affirmations'),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary/10 px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-2xl font-bold mb-2">Activities</h1>
          <p className="text-muted-foreground text-sm">
            Choose an activity to boost your wellbeing
          </p>
        </motion.div>
      </div>

      <div className="px-4 -mt-4 max-w-md mx-auto space-y-4">
        {activities.map((activity, activityIndex) => {
          const ActivityIcon = activity.icon;
          return (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * activityIndex }}
            >
              <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="bg-primary/10 p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/20">
                      <ActivityIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 space-y-5">
                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {activity.features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="p-3 rounded-lg bg-muted/50"
                        >
                          <Icon className="w-5 h-5 text-primary mb-2" />
                          <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={activity.onClick}
                  >
                    {activity.cta}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
