-- Create enum types for onboarding options
CREATE TYPE public.journey_stage AS ENUM ('exploring', 'awaiting_diagnosis', 'post_diagnosis', 'supporting_others');
CREATE TYPE public.support_preference AS ENUM ('just_chatting', 'guided_insights', 'peer_support', 'professional_resources');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudonym TEXT NOT NULL,
  first_name TEXT,
  date_of_birth DATE,
  bio TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for journey stage (step 1)
CREATE TABLE public.user_journey_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stage journey_stage NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for challenges/themes (step 2 - many to many)
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge)
);

-- Create table for support preferences (step 3)
CREATE TABLE public.user_support_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preference support_preference NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, preference)
);

-- Create table for communication boundaries (step 4)
CREATE TABLE public.user_boundaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  allow_direct_messages BOOLEAN DEFAULT true,
  allow_group_chats BOOLEAN DEFAULT true,
  preferred_response_time TEXT DEFAULT 'whenever',
  topics_to_avoid TEXT[],
  additional_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_support_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_boundaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Public profile view policy (pseudonym + onboarding data only)
CREATE POLICY "Anyone can view public profile info"
ON public.profiles FOR SELECT
USING (onboarding_completed = true);

-- RLS Policies for journey stages
CREATE POLICY "Users can view their own journey stage"
ON public.user_journey_stages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journey stage"
ON public.user_journey_stages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey stage"
ON public.user_journey_stages FOR UPDATE
USING (auth.uid() = user_id);

-- Public view for journey stages
CREATE POLICY "Anyone can view journey stages of completed profiles"
ON public.user_journey_stages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = user_journey_stages.user_id 
  AND profiles.onboarding_completed = true
));

-- RLS Policies for challenges
CREATE POLICY "Users can manage their own challenges"
ON public.user_challenges FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view challenges of completed profiles"
ON public.user_challenges FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = user_challenges.user_id 
  AND profiles.onboarding_completed = true
));

-- RLS Policies for support preferences
CREATE POLICY "Users can manage their own support preferences"
ON public.user_support_preferences FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view support preferences of completed profiles"
ON public.user_support_preferences FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = user_support_preferences.user_id 
  AND profiles.onboarding_completed = true
));

-- RLS Policies for boundaries (private - only owner can see)
CREATE POLICY "Users can manage their own boundaries"
ON public.user_boundaries FOR ALL
USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_boundaries_updated_at
BEFORE UPDATE ON public.user_boundaries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, pseudonym)
  VALUES (NEW.id, 'Vestra_' || substring(NEW.id::text from 1 for 8));
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();