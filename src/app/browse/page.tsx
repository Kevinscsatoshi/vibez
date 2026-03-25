import { createClient } from "@/lib/supabase-server";
import { getAllProjects } from "@/lib/sample-data";
import type { Project } from "@/types/database";
import { BrowseClient } from "./browse-client";

function normalizeProject(record: Record<string, unknown>): Project {
  return {
    ...(record as unknown as Project),
    prompts: (record.prompts as Project["prompts"]) ?? [],
    iterations: (record.iterations as Project["iterations"]) ?? [],
    metrics: (record.metrics as Project["metrics"]) ?? [],
    stack_tags: (record.stack_tags as string[]) ?? [],
    screenshots: (record.screenshots as string[]) ?? [],
    who_is_this_for: (record.who_is_this_for as string[]) ?? [],
    required_tools: (record.required_tools as Project["required_tools"]) ?? [],
    steps: (record.steps as Project["steps"]) ?? [],
    common_failures: (record.common_failures as Project["common_failures"]) ?? [],
    difficulty: (record.difficulty as Project["difficulty"]) ?? null,
    coding_required: (record.coding_required as Project["coding_required"]) ?? null,
    estimated_time: (record.estimated_time as string) ?? null,
    category: (record.category as string) ?? null,
    completion_count: (record.completion_count as number) ?? 0,
    save_count: (record.save_count as number) ?? 0,
    remix_count: (record.remix_count as number) ?? 0,
  };
}

async function getAllRecipes(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*, author:profiles(*)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(100);

    if (data && data.length > 0) {
      return data.map((row) => normalizeProject(row as Record<string, unknown>));
    }
  } catch {
    // fall through
  }
  return getAllProjects();
}

export default async function BrowsePage() {
  const recipes = await getAllRecipes();
  return <BrowseClient recipes={recipes} />;
}
