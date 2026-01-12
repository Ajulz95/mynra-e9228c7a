-- Update the handle_new_user function to use Mynra_ prefix instead of Vestra_
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, pseudonym)
  VALUES (NEW.id, 'Mynra_' || substring(NEW.id::text from 1 for 8));
  RETURN NEW;
END;
$$;