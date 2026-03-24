-- Project likes table
CREATE TABLE public.project_likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, project_id)
);

ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read likes (for counts and checking if user liked)
CREATE POLICY "Likes are viewable by everyone"
  ON public.project_likes FOR SELECT
  USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Users can insert own likes"
  ON public.project_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes (unlike)
CREATE POLICY "Users can delete own likes"
  ON public.project_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Add like_count to projects (denormalized for performance)
ALTER TABLE public.projects ADD COLUMN like_count INTEGER DEFAULT 0 NOT NULL;

-- Indexes
CREATE INDEX idx_project_likes_project_id ON public.project_likes(project_id);
CREATE INDEX idx_project_likes_user_id ON public.project_likes(user_id);

-- Trigger to maintain like_count
CREATE OR REPLACE FUNCTION public.update_like_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects SET like_count = like_count + 1 WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects SET like_count = like_count - 1 WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_changed
  AFTER INSERT OR DELETE ON public.project_likes
  FOR EACH ROW EXECUTE PROCEDURE public.update_like_count();
