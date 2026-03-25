-- 008: Recipe system — add recipe fields, saves, completions, community notes

-- Add recipe-specific columns to projects table
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS difficulty text CHECK (difficulty IN ('beginner','intermediate','advanced')),
  ADD COLUMN IF NOT EXISTS coding_required text CHECK (coding_required IN ('none','minimal','moderate','heavy')),
  ADD COLUMN IF NOT EXISTS estimated_time text,
  ADD COLUMN IF NOT EXISTS who_is_this_for text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS cost_estimate text,
  ADD COLUMN IF NOT EXISTS outcome_description text,
  ADD COLUMN IF NOT EXISTS required_tools jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS steps jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS common_failures jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS completion_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS save_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS remix_count integer DEFAULT 0;

-- Add persona to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS persona text;

-- Recipe saves (bookmarks — no single-save restriction)
CREATE TABLE IF NOT EXISTS public.recipe_saves (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  recipe_id uuid REFERENCES public.projects ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

ALTER TABLE public.recipe_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view saves" ON public.recipe_saves FOR SELECT USING (true);
CREATE POLICY "Users manage own saves" ON public.recipe_saves FOR ALL USING (auth.uid() = user_id);

-- Recipe completions
CREATE TABLE IF NOT EXISTS public.recipe_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  recipe_id uuid REFERENCES public.projects ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('completed','completed_with_modifications','had_issues')),
  notes text,
  step_failed integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.recipe_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view completions" ON public.recipe_completions FOR SELECT USING (true);
CREATE POLICY "Users manage own completions" ON public.recipe_completions FOR ALL USING (auth.uid() = user_id);

-- Community notes
CREATE TABLE IF NOT EXISTS public.community_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES public.projects ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  note_type text NOT NULL CHECK (note_type IN ('tip','alternative','bug_report','adaptation','result')),
  content text NOT NULL,
  screenshot_url text,
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.community_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view notes" ON public.community_notes FOR SELECT USING (true);
CREATE POLICY "Users manage own notes" ON public.community_notes FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Recipe owners can pin notes" ON public.community_notes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = recipe_id AND author_id = auth.uid()));

-- Trigger: update save_count on recipe_saves changes
CREATE OR REPLACE FUNCTION public.update_save_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects SET save_count = save_count + 1 WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects SET save_count = save_count - 1 WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_recipe_save_change ON public.recipe_saves;
CREATE TRIGGER on_recipe_save_change
  AFTER INSERT OR DELETE ON public.recipe_saves
  FOR EACH ROW EXECUTE FUNCTION public.update_save_count();

-- Trigger: update completion_count on recipe_completions changes
CREATE OR REPLACE FUNCTION public.update_completion_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects SET completion_count = completion_count + 1 WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects SET completion_count = completion_count - 1 WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_recipe_completion_change ON public.recipe_completions;
CREATE TRIGGER on_recipe_completion_change
  AFTER INSERT OR DELETE ON public.recipe_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_completion_count();

-- Remove the single-like restriction from project_likes
-- (The old toggle logic in the app enforced single-like; we keep the table as-is
--  but the app code will be updated to allow multiple likes.)
