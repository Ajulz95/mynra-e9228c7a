import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ChevronRight, Flame, Trophy, Target, Sparkles, Brain, Palette, Music, Gamepad2, Focus, Puzzle, Zap, Brush, Pencil, Image, Headphones, Volume2, Radio, Waves, Dices, Smile, PartyPopper, Medal } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const selfCareFeatures = [
  { icon: Target, title: 'Daily Challenges', description: 'Simple wellness tasks to complete each day' },
  { icon: Flame, title: 'Streak Tracking', description: 'Build healthy habits with daily streaks' },
  { icon: Trophy, title: 'Earn Points', description: 'Gain self-care points for completing tasks' },
  { icon: Sparkles, title: 'Celebrate Progress', description: 'Watch your wellness journey grow' },
];

const mindfulnessFeatures = [
  { icon: Brain, title: 'Focus Games', description: 'Train your attention and presence' },
  { icon: Puzzle, title: 'Calming Puzzles', description: 'Gentle challenges to quiet the mind' },
  { icon: Focus, title: 'Meditation Aids', description: 'Interactive tools for mindfulness' },
  { icon: Zap, title: 'Quick Sessions', description: 'Mindful moments in just minutes' },
];

const creativeFeatures = [
  { icon: Palette, title: 'Art Activities', description: 'Express yourself through colors and shapes' },
  { icon: Brush, title: 'Drawing Tools', description: 'Simple and relaxing art exercises' },
  { icon: Pencil, title: 'Writing Prompts', description: 'Creative journaling and storytelling' },
  { icon: Image, title: 'Visual Projects', description: 'Create something beautiful today' },
];

const soundFeatures = [
  { icon: Headphones, title: 'Guided Audio', description: 'Calming narrations and meditations' },
  { icon: Volume2, title: 'Ambient Sounds', description: 'Nature and relaxation soundscapes' },
  { icon: Radio, title: 'Music Therapy', description: 'Curated playlists for wellness' },
  { icon: Waves, title: 'Sleep Sounds', description: 'Drift off with soothing audio' },
];

const gamesFeatures = [
  { icon: Gamepad2, title: 'Casual Games', description: 'Light-hearted fun to lift your mood' },
  { icon: Dices, title: 'Random Challenges', description: 'Surprise activities to try' },
  { icon: PartyPopper, title: 'Mood Boosters', description: 'Quick games for instant smiles' },
  { icon: Medal, title: 'Achievements', description: 'Unlock rewards as you play' },
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
      icon: Brain,
      title: 'Mindfulness Games',
      description: 'Relaxing activities to calm your mind and train focus',
      features: mindfulnessFeatures,
      cta: 'Play Now',
      onClick: () => handleComingSoon('Mindfulness Games'),
    },
    {
      icon: Palette,
      title: 'Creative Corner',
      description: 'Express yourself through art, writing, and creativity',
      features: creativeFeatures,
      cta: 'Get Creative',
      onClick: () => handleComingSoon('Creative Corner'),
    },
    {
      icon: Headphones,
      title: 'Sound Therapy',
      description: 'Soothing sounds and music for relaxation and sleep',
      features: soundFeatures,
      cta: 'Listen Now',
      onClick: () => handleComingSoon('Sound Therapy'),
    },
    {
      icon: Gamepad2,
      title: 'Fun Games',
      description: 'Light-hearted games to lift your mood and have fun',
      features: gamesFeatures,
      cta: 'Start Playing',
      onClick: () => handleComingSoon('Fun Games'),
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
