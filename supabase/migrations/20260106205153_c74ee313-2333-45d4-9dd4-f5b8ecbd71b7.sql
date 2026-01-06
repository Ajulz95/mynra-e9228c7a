-- Create connection requests table
CREATE TABLE public.connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(requester_id, recipient_id)
);

-- Enable RLS
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;

-- Users can view requests they sent or received
CREATE POLICY "Users can view their own requests"
ON public.connection_requests FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Users can create requests
CREATE POLICY "Users can create requests"
ON public.connection_requests FOR INSERT
WITH CHECK (auth.uid() = requester_id);

-- Users can update requests they received (to accept/decline)
CREATE POLICY "Recipients can update request status"
ON public.connection_requests FOR UPDATE
USING (auth.uid() = recipient_id);

-- Users can delete their own sent requests
CREATE POLICY "Users can delete their sent requests"
ON public.connection_requests FOR DELETE
USING (auth.uid() = requester_id);

-- Trigger for updated_at
CREATE TRIGGER update_connection_requests_updated_at
BEFORE UPDATE ON public.connection_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if two users are matched (mutual connection)
CREATE OR REPLACE FUNCTION public.are_users_matched(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.connection_requests
    WHERE requester_id = user1_id AND recipient_id = user2_id AND status = 'accepted'
  ) AND EXISTS (
    SELECT 1 FROM public.connection_requests
    WHERE requester_id = user2_id AND recipient_id = user1_id AND status = 'accepted'
  );
$$;

-- Function to check connection status between users
CREATE OR REPLACE FUNCTION public.get_connection_status(current_user_id UUID, other_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    -- Check if mutually matched
    WHEN public.are_users_matched(current_user_id, other_user_id) THEN 'matched'
    -- Check if current user sent pending request
    WHEN EXISTS (
      SELECT 1 FROM public.connection_requests
      WHERE requester_id = current_user_id AND recipient_id = other_user_id AND status = 'pending'
    ) THEN 'pending_sent'
    -- Check if current user received pending request
    WHEN EXISTS (
      SELECT 1 FROM public.connection_requests
      WHERE requester_id = other_user_id AND recipient_id = current_user_id AND status = 'pending'
    ) THEN 'pending_received'
    -- Check if current user accepted but other hasn't
    WHEN EXISTS (
      SELECT 1 FROM public.connection_requests
      WHERE requester_id = current_user_id AND recipient_id = other_user_id AND status = 'accepted'
    ) THEN 'awaiting_match'
    ELSE 'none'
  END;
$$;