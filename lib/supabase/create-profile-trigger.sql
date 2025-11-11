-- Automatisches Profile erstellen für neue User
-- Dieses SQL-Script erstellt einen Trigger, der automatisch ein Profile erstellt,
-- wenn ein neuer User sich registriert (Email oder OAuth)

-- Function die aufgerufen wird, wenn ein neuer User erstellt wird
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Trigger der die Function aufruft
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
