-- Link projects to one playground snippet (optional)
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS snippet_id UUID REFERENCES public.snippets(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_snippet_id ON public.projects(snippet_id);
