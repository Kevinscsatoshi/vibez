"use client";

import { useRouter } from "next/navigation";
import { PlaygroundEditor } from "@/components/playground-editor";
import { saveSnippet, forkSnippet } from "../actions";
import type { Snippet } from "@/types/database";

interface SnippetClientProps {
  snippet: Snippet;
  isAuthor: boolean;
}

export function SnippetClient({ snippet, isAuthor }: SnippetClientProps) {
  const router = useRouter();

  const handleSave = async (data: {
    title: string;
    html: string;
    css: string;
    js: string;
  }) => {
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("html", data.html);
    formData.set("css", data.css);
    formData.set("js", data.js);
    formData.set("snippetId", snippet.id);

    const result = await saveSnippet(formData);
    if (result?.error === "not_authenticated") {
      router.push(
        `/signin?next=${encodeURIComponent(`/playground/${snippet.id}`)}`
      );
      return;
    }
    if (result?.error) {
      alert(result.error);
    }
  };

  const handleFork = async () => {
    const result = await forkSnippet(snippet.id);
    if (result?.error === "not_authenticated") {
      router.push(
        `/signin?next=${encodeURIComponent(`/playground/${snippet.id}`)}`
      );
      return;
    }
    if (result?.error) {
      alert(result.error);
    }
    // redirect happens in server action
  };

  return (
    <PlaygroundEditor
      snippet={snippet}
      onSave={handleSave}
      onFork={handleFork}
      readOnly={!isAuthor}
      isAuthor={isAuthor}
    />
  );
}
