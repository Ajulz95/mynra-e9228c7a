import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ChevronRight, Flame, Trophy, Target, Sparkles } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { motion } from 'framer-motion';

const selfCareFeatures = [
  {
    icon: Target,
    title: 'Daily Challenges',
    description: 'Simple wellness tasks to complete each day',
  },
  {
    icon: Flame,
    title: 'Streak Tracking',
    description: 'Build healthy habits with daily streaks',
  },
  {
    icon: Trophy,
    title: 'Earn Points',
    description: 'Gain self-care points for completing tasks',
  },
  {
    icon: Sparkles,
    title: 'Celebrate Progress',
    description: 'Watch your wellness journey grow',
  },
];

export default function Activities() {
  const navigate = useNavigate();

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

      <div className="px-4 -mt-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="bg-primary/10 p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">Daily Self-Care</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete daily wellness challenges and track your progress
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3">
                {selfCareFeatures.map((feature, index) => {
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
                onClick={() => navigate('/activities/self-care')}
              >
                Start Today's Challenges
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
