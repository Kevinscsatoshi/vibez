-- Snippets table for the playground
CREATE TABLE public.snippets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled',
  html TEXT NOT NULL DEFAULT '',
  css TEXT NOT NULL DEFAULT '',
  js TEXT NOT NULL DEFAULT '',
  is_public BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

-- Public snippets readable by all
CREATE POLICY "Public snippets are viewable by everyone"
  ON public.snippets FOR SELECT
  USING (is_public = true OR author_id = auth.uid());

-- Authenticated users can insert own snippets
CREATE POLICY "Users can insert own snippets"
  ON public.snippets FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Users can update own snippets
CREATE POLICY "Users can update own snippets"
  ON public.snippets FOR UPDATE
  USING (auth.uid() = author_id);

-- Users can delete own snippets
CREATE POLICY "Users can delete own snippets"
  ON public.snippets FOR DELETE
  USING (auth.uid() = author_id);

-- Indexes
CREATE INDEX idx_snippets_author_id ON public.snippets(author_id);
CREATE INDEX idx_snippets_created_at ON public.snippets(created_at DESC);

-- Auto-update updated_at
CREATE TRIGGER on_snippet_updated
  BEFORE UPDATE ON public.snippets
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
