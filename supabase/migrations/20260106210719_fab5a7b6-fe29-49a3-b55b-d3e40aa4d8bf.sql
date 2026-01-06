-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('connection_request', 'connection_accepted', 'match_complete')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- System can insert notifications (via trigger with security definer)
CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Function to create notification on connection request
CREATE OR REPLACE FUNCTION public.notify_connection_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  requester_pseudonym TEXT;
BEGIN
  -- Get requester's pseudonym
  SELECT pseudonym INTO requester_pseudonym
  FROM public.profiles
  WHERE user_id = NEW.requester_id;

  -- Create notification for recipient
  INSERT INTO public.notifications (user_id, type, title, message, related_user_id)
  VALUES (
    NEW.recipient_id,
    'connection_request',
    'New Connection Request',
    'Someone wants to connect with you!',
    NEW.requester_id
  );

  RETURN NEW;
END;
$$;

-- Trigger for new connection requests
CREATE TRIGGER on_connection_request_created
AFTER INSERT ON public.connection_requests
FOR EACH ROW
WHEN (NEW.status = 'pending')
EXECUTE FUNCTION public.notify_connection_request();

-- Function to notify when connection is accepted (potential match)
CREATE OR REPLACE FUNCTION public.notify_connection_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_mutual_match BOOLEAN;
BEGIN
  -- Only proceed if status changed to accepted
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    -- Check if this creates a mutual match
    SELECT EXISTS (
      SELECT 1 FROM public.connection_requests
      WHERE requester_id = NEW.recipient_id 
      AND recipient_id = NEW.requester_id 
      AND status = 'accepted'
    ) INTO is_mutual_match;

    IF is_mutual_match THEN
      -- Notify both users about the match
      INSERT INTO public.notifications (user_id, type, title, message, related_user_id)
      VALUES 
        (NEW.requester_id, 'match_complete', 'It''s a Match! 🎉', 'You can now see their full profile and connect!', NEW.recipient_id),
        (NEW.recipient_id, 'match_complete', 'It''s a Match! 🎉', 'You can now see their full profile and connect!', NEW.requester_id);
    ELSE
      -- Notify the original requester that their request was accepted
      INSERT INTO public.notifications (user_id, type, title, message, related_user_id)
      VALUES (
        NEW.requester_id,
        'connection_accepted',
        'Connection Accepted',
        'Your connection request was accepted! Accept them back to match.',
        NEW.recipient_id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for accepted connections
CREATE TRIGGER on_connection_accepted
AFTER UPDATE ON public.connection_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_connection_accepted();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;