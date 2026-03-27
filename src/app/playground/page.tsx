import { Metadata } from "next";
import { PlaygroundClient } from "./playground-client";
import { createClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Playground — VibeZ",
  description: "Build and share HTML/CSS/JS snippets in the browser",
};

type SearchParams = Promise<{ recipe?: string }>;

async function getRecipeCode(recipeId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("title, steps")
      .eq("id", recipeId)
      .single();

    if (!data) return null;

    // Extract the first step that has a prompt with code-like content
    const steps = (data.steps as Array<{ title: string; prompt: string; description: string }>) ?? [];
    const codeStep = steps.find((s) => s.prompt && s.prompt.length > 0);

    return {
      title: data.title as string,
      prompt: codeStep?.prompt ?? "",
      description: codeStep?.description ?? "",
    };
  } catch {
    return null;
  }
}

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { recipe } = await searchParams;
  let recipeData: { title: string; prompt: string; description: string } | null = null;

  if (recipe) {
    recipeData = await getRecipeCode(recipe);
  }

  return <PlaygroundClient recipeData={recipeData} />;
}
