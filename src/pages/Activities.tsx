import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Gamepad2, Brain, Music, Palette, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  available: boolean;
  gradient: string;
}

const activities: Activity[] = [
  {
    id: 'self-care',
    title: 'Daily Self-Care',
    description: 'Complete daily wellness challenges and track your progress',
    icon: Heart,
    path: '/activities/self-care',
    available: true,
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness Games',
    description: 'Relaxing activities to calm your mind',
    icon: Brain,
    path: '/activities/mindfulness',
    available: false,
    gradient: 'from-purple-500/20 to-indigo-500/20',
  },
  {
    id: 'creative',
    title: 'Creative Corner',
    description: 'Express yourself through art and creativity',
    icon: Palette,
    path: '/activities/creative',
    available: false,
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  {
    id: 'music',
    title: 'Sound Therapy',
    description: 'Soothing sounds and music for relaxation',
    icon: Music,
    path: '/activities/music',
    available: false,
    gradient: 'from-cyan-500/20 to-teal-500/20',
  },
  {
    id: 'games',
    title: 'Fun Games',
    description: 'Light-hearted games to lift your mood',
    icon: Gamepad2,
    path: '/activities/games',
    available: false,
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
];

export default function Activities() {
  const navigate = useNavigate();

  const handleActivityClick = (activity: Activity) => {
    if (activity.available) {
      navigate(activity.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/30 px-6 pt-12 pb-8">
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

      <div className="px-4 -mt-4 max-w-md mx-auto space-y-3">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`bg-card/80 backdrop-blur-sm border-border/50 shadow-sm transition-all ${
                  activity.available 
                    ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]' 
                    : 'opacity-60'
                }`}
                onClick={() => handleActivityClick(activity)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.gradient}`}>
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{activity.title}</h3>
                        {!activity.available && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {activity.description}
                      </p>
                    </div>
                    {activity.available && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
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
