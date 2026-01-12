-- Create table for daily challenge definitions
CREATE TABLE public.daily_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 10,
  icon TEXT DEFAULT 'heart',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user challenge completions
CREATE TABLE public.user_challenge_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  points_earned INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id, completed_date)
);

-- Create table for user gamification stats
CREATE TABLE public.user_gamification_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for daily_challenges (everyone can read)
CREATE POLICY "Anyone can view active challenges" 
ON public.daily_challenges 
FOR SELECT 
USING (is_active = true);

-- RLS policies for user_challenge_completions
CREATE POLICY "Users can view their own completions" 
ON public.user_challenge_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own completions" 
ON public.user_challenge_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_gamification_stats
CREATE POLICY "Users can view their own stats" 
ON public.user_gamification_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON public.user_gamification_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_gamification_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert default daily challenges
INSERT INTO public.daily_challenges (title, description, points, icon) VALUES
('Take 3 slow breaths', 'Pause and breathe deeply to center yourself', 10, 'wind'),
('Step outside for fresh air', 'Even a few minutes outdoors can lift your mood', 10, 'sun'),
('Drink a glass of water', 'Stay hydrated for your wellbeing', 10, 'droplets'),
('Write one thing you''re grateful for', 'Gratitude helps shift perspective', 10, 'heart');

-- Function to update gamification stats when a challenge is completed
CREATE OR REPLACE FUNCTION public.update_gamification_on_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  stats_record user_gamification_stats%ROWTYPE;
  days_since_last INTEGER;
BEGIN
  -- Get or create user stats
  SELECT * INTO stats_record FROM user_gamification_stats WHERE user_id = NEW.user_id;
  
  IF stats_record IS NULL THEN
    INSERT INTO user_gamification_stats (user_id, total_points, current_streak, last_active_date)
    VALUES (NEW.user_id, NEW.points_earned, 1, NEW.completed_date)
    RETURNING * INTO stats_record;
  ELSE
    -- Calculate days since last activity
    IF stats_record.last_active_date IS NOT NULL THEN
      days_since_last := NEW.completed_date - stats_record.last_active_date;
    ELSE
      days_since_last := 999;
    END IF;
    
    -- Update stats based on streak logic
    IF days_since_last = 0 THEN
      -- Same day, just add points
      UPDATE user_gamification_stats 
      SET total_points = total_points + NEW.points_earned,
          updated_at = now()
      WHERE user_id = NEW.user_id;
    ELSIF days_since_last = 1 THEN
      -- Consecutive day, increment streak
      UPDATE user_gamification_stats 
      SET total_points = total_points + NEW.points_earned,
          current_streak = current_streak + 1,
          longest_streak = GREATEST(longest_streak, current_streak + 1),
          last_active_date = NEW.completed_date,
          updated_at = now()
      WHERE user_id = NEW.user_id;
    ELSE
      -- Missed days - keep streak frozen (gentle streak logic)
      UPDATE user_gamification_stats 
      SET total_points = total_points + NEW.points_earned,
          last_active_date = NEW.completed_date,
          updated_at = now()
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to update stats on completion
CREATE TRIGGER on_challenge_completion
AFTER INSERT ON public.user_challenge_completions
FOR EACH ROW
EXECUTE FUNCTION public.update_gamification_on_completion();

-- Trigger for updated_at on gamification stats
CREATE TRIGGER update_gamification_stats_updated_at
BEFORE UPDATE ON public.user_gamification_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();