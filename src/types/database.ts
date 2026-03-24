export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  title: string;
  one_liner: string;
  what_i_built: string;
  why_i_built: string;
  prompts: PromptBlock[];
  iterations: Iteration[];
  failures: string | null;
  stack_tags: string[];
  screenshots: string[];
  demo_html_url: string | null;
  demo_link: string | null;
  video_url: string | null;
  metrics: Metric[];
  lessons: string | null;
  github_repo_url: string | null;
  github_repo_name: string | null;
  github_repo_description: string | null;
  github_repo_language: string | null;
  github_repo_stars: number | null;
  github_repo_updated_at: string | null;
  github_readme: string | null;
  forked_from: string | null;
  fork_description: string | null;
  fork_count: number;
  view_count: number;
  status: "draft" | "pending" | "published";
  featured: boolean;
  // joined fields
  author?: Profile;
  parent_project?: Pick<Project, "id" | "title" | "author"> | null;
}

export interface PromptBlock {
  label: string;
  prompt: string;
  model: string;
}

export interface Iteration {
  version: string;
  what_changed: string;
  result: string;
}

export interface Metric {
  name: string;
  value: string;
  timeframe: string;
}

export interface Profile {
  id: string;
  github_username: string;
  display_name: string;
  avatar_url: string;
  avatar_source: "github" | "preset";
  avatar_preset_id: string | null;
  gender: "male" | "female" | null;
  bio: string | null;
  github_url: string;
  created_at: string;
}
