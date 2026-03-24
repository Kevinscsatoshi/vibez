-- GitHub OAuth connections per user
CREATE TABLE IF NOT EXISTS public.github_connections (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_user_id BIGINT NOT NULL,
  github_login TEXT NOT NULL,
  access_token TEXT NOT NULL,
  scope TEXT,
  token_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.github_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own github connection" ON public.github_connections;
CREATE POLICY "Users can view own github connection"
  ON public.github_connections FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can upsert own github connection" ON public.github_connections;
CREATE POLICY "Users can upsert own github connection"
  ON public.github_connections FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own github connection" ON public.github_connections;
CREATE POLICY "Users can update own github connection"
  ON public.github_connections FOR UPDATE
  USING (user_id = auth.uid());

-- Link projects to GitHub repositories
CREATE TABLE IF NOT EXISTS public.project_repo_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  repo_full_name TEXT NOT NULL,
  repo_default_branch TEXT,
  repo_webhook_id BIGINT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.project_repo_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Repo links are readable for published projects or owner" ON public.project_repo_links;
CREATE POLICY "Repo links are readable for published projects or owner"
  ON public.project_repo_links FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.projects p
      WHERE p.id = project_id
        AND (p.status = 'published' OR p.author_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert own repo links" ON public.project_repo_links;
CREATE POLICY "Users can insert own repo links"
  ON public.project_repo_links FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own repo links" ON public.project_repo_links;
CREATE POLICY "Users can update own repo links"
  ON public.project_repo_links FOR UPDATE
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_project_repo_links_repo_full_name
  ON public.project_repo_links(repo_full_name);

-- Sync logs for observability
CREATE TABLE IF NOT EXISTS public.project_sync_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  repo_full_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.project_sync_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sync events are readable by project owner" ON public.project_sync_events;
CREATE POLICY "Sync events are readable by project owner"
  ON public.project_sync_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects p
      WHERE p.id = project_id
        AND p.author_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Sync events insert by owner" ON public.project_sync_events;
CREATE POLICY "Sync events insert by owner"
  ON public.project_sync_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.projects p
      WHERE p.id = project_id
        AND p.author_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_project_sync_events_project_id
  ON public.project_sync_events(project_id);

-- Reuse existing updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_github_connection_updated'
  ) THEN
    CREATE TRIGGER on_github_connection_updated
      BEFORE UPDATE ON public.github_connections
      FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_project_repo_link_updated'
  ) THEN
    CREATE TRIGGER on_project_repo_link_updated
      BEFORE UPDATE ON public.project_repo_links
      FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
  END IF;
END $$;
