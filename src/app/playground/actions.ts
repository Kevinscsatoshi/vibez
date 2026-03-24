"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function saveSnippet(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_authenticated" };
  }

  const title = (formData.get("title") as string)?.trim() || "Untitled";
  const html = (formData.get("html") as string) ?? "";
  const css = (formData.get("css") as string) ?? "";
  const js = (formData.get("js") as string) ?? "";
  const snippetId = formData.get("snippetId") as string | null;

  if (snippetId) {
    // Update existing
    const { error } = await supabase
      .from("snippets")
      .update({ title, html, css, js })
      .eq("id", snippetId)
      .eq("author_id", user.id);

    if (error) {
      return { error: error.message };
    }
    return { id: snippetId };
  }

  // Create new
  const { data, error } = await supabase
    .from("snippets")
    .insert({ author_id: user.id, title, html, css, js })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/playground/${data.id}`);
}

export async function forkSnippet(snippetId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_authenticated" };
  }

  // Fetch original
  const { data: original, error: fetchError } = await supabase
    .from("snippets")
    .select("title, html, css, js")
    .eq("id", snippetId)
    .single();

  if (fetchError || !original) {
    return { error: "Snippet not found" };
  }

  // Create fork
  const { data, error } = await supabase
    .from("snippets")
    .insert({
      author_id: user.id,
      title: `${original.title} (fork)`,
      html: original.html,
      css: original.css,
      js: original.js,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  redirect(`/playground/${data.id}`);
}
