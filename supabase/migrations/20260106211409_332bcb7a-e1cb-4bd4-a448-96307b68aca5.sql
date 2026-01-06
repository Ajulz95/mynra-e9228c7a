-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient conversation queries
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX idx_messages_participants ON public.messages(sender_id, recipient_id);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can only send messages (insert) as themselves
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they received (mark as read)
CREATE POLICY "Users can mark messages as read"
ON public.messages FOR UPDATE
USING (auth.uid() = recipient_id);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('harassment', 'inappropriate_content', 'spam', 'impersonation', 'other')),
  description TEXT,
  message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view their reports"
ON public.reports FOR SELECT
USING (auth.uid() = reporter_id);

-- Function to generate consistent conversation ID for two users
CREATE OR REPLACE FUNCTION public.get_conversation_id(user1 UUID, user2 UUID)
RETURNS UUID
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN user1 < user2 THEN uuid_generate_v5(uuid_nil(), user1::text || user2::text)
    ELSE uuid_generate_v5(uuid_nil(), user2::text || user1::text)
  END;
$$;

-- Function to count messages sent by a user in a conversation
CREATE OR REPLACE FUNCTION public.count_user_messages_in_conversation(p_user_id UUID, p_conversation_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER 
  FROM public.messages 
  WHERE sender_id = p_user_id 
  AND conversation_id = p_conversation_id;
$$;

-- Function to check if voice call is unlocked (both users have 20+ messages)
CREATE OR REPLACE FUNCTION public.is_voice_call_unlocked(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    public.count_user_messages_in_conversation(user1_id, public.get_conversation_id(user1_id, user2_id)) >= 20
    AND
    public.count_user_messages_in_conversation(user2_id, public.get_conversation_id(user1_id, user2_id)) >= 20;
$$;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;