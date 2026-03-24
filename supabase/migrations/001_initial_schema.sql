-- Vibez: Initial database schema

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  github_username text not null,
  display_name text not null,
  avatar_url text,
  avatar_source text default 'github' not null check (avatar_source in ('github', 'preset')),
  avatar_preset_id text,
  gender text check (gender in ('male', 'female')),
  bio text,
  github_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  one_liner text not null,
  what_i_built text not null,
  why_i_built text not null,
  prompts jsonb not null default '[]'::jsonb,
  iterations jsonb not null default '[]'::jsonb,
  failures text,
  stack_tags text[] not null default '{}',
  screenshots text[] not null default '{}',
  demo_html_url text,
  demo_link text,
  video_url text,
  metrics jsonb not null default '[]'::jsonb,
  lessons text,
  github_repo_url text,
  github_repo_name text,
  github_repo_description text,
  github_repo_language text,
  github_repo_stars integer,
  github_repo_updated_at timestamptz,
  github_readme text,
  forked_from uuid references public.projects(id) on delete set null,
  fork_description text,
  fork_count integer default 0 not null,
  view_count integer default 0 not null,
  status text default 'pending' not null check (status in ('draft', 'pending', 'published')),
  featured boolean default false not null
);

alter table public.projects enable row level security;

create policy "Published projects are viewable by everyone"
  on public.projects for select
  using (status = 'published' or author_id = auth.uid());

create policy "Users can insert own projects"
  on public.projects for insert
  with check (author_id = auth.uid());

create policy "Users can update own projects"
  on public.projects for update
  using (author_id = auth.uid());

-- Indexes
create index idx_projects_author_id on public.projects(author_id);
create index idx_projects_status on public.projects(status);
create index idx_projects_featured on public.projects(featured) where featured = true;
create index idx_projects_created_at on public.projects(created_at desc);
create index idx_projects_forked_from on public.projects(forked_from) where forked_from is not null;
create index idx_projects_stack_tags on public.projects using gin(stack_tags);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, github_username, display_name, avatar_url, github_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'preferred_username', 'user'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'user_name', 'Builder'),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'https://github.com/' || coalesce(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'preferred_username', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to increment fork count on parent project
create or replace function public.increment_fork_count()
returns trigger as $$
begin
  if new.forked_from is not null then
    update public.projects
    set fork_count = fork_count + 1
    where id = new.forked_from;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_project_forked
  after insert on public.projects
  for each row execute procedure public.increment_fork_count();

-- Function to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_project_updated
  before update on public.projects
  for each row execute procedure public.handle_updated_at();
