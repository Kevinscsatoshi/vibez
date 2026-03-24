-- Fix profiles table for email-only signups (no GitHub metadata)

-- Make github_username nullable (email signups won't have one)
ALTER TABLE public.profiles ALTER COLUMN github_username DROP NOT NULL;

-- Replace the handle_new_user trigger function to handle email signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  gh_username text;
BEGIN
  gh_username := coalesce(
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'preferred_username'
  );

  INSERT INTO public.profiles (id, github_username, display_name, avatar_url, avatar_source, github_url)
  VALUES (
    new.id,
    gh_username,  -- NULL for email signups
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'display_name',
      gh_username,
      'Builder'
    ),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    CASE WHEN new.raw_user_meta_data->>'avatar_url' IS NOT NULL
         THEN 'github' ELSE 'preset' END,
    CASE WHEN gh_username IS NOT NULL
         THEN 'https://github.com/' || gh_username
         ELSE NULL END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add insert policy for profiles (the trigger runs as SECURITY DEFINER,
-- but users also need to be able to insert via the onboarding flow)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
