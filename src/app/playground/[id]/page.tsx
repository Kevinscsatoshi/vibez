import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { Metadata } from "next";
import { SnippetClient } from "./snippet-client";
import type { Snippet } from "@/types/database";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("snippets")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: data ? `${data.title} — Playground — vibeZ` : "Playground — vibeZ",
  };
}

export default async function SnippetPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: snippet, error } = await supabase
    .from("snippets")
    .select("*, author:profiles(*)")
    .eq("id", id)
    .single();

  if (error || !snippet) notFound();

  // Check if current user is the author
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthor = user?.id === snippet.author_id;

  return (
    <SnippetClient
      snippet={snippet as Snippet}
      isAuthor={isAuthor}
    />
  );
}
