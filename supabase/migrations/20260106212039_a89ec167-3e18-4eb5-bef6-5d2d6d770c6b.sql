-- Create journal entries table
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 5),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX idx_journal_entries_user_date ON public.journal_entries(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Users can only access their own entries (completely private)
CREATE POLICY "Users can manage their own journal entries"
ON public.journal_entries FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create symptoms tracking table
CREATE TABLE public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptom TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index
CREATE INDEX idx_symptom_logs_user_date ON public.symptom_logs(user_id, logged_at DESC);

-- Enable RLS
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own symptoms
CREATE POLICY "Users can manage their own symptom logs"
ON public.symptom_logs FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger for journal updated_at
CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();