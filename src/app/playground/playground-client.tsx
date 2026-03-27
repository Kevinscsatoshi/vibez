"use client";

import { useRouter } from "next/navigation";
import { PlaygroundEditor } from "@/components/playground-editor";
import { saveSnippet } from "./actions";

interface PlaygroundClientProps {
  recipeData?: {
    title: string;
    prompt: string;
    description: string;
  } | null;
}

export function PlaygroundClient({ recipeData }: PlaygroundClientProps) {
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

    const result = await saveSnippet(formData);
    if (result?.error === "not_authenticated") {
      router.push(
        `/signin?next=${encodeURIComponent("/playground")}`
      );
      return;
    }
    if (result?.error) {
      alert(result.error);
    }
    // redirect happens in server action for new snippets
  };

  // If loaded from a recipe, pre-populate with recipe context as HTML comment
  const initialHtml = recipeData
    ? `<!-- Recipe: ${recipeData.title} -->\n<!-- ${recipeData.description} -->\n\n<div class="container">\n  <h1>${recipeData.title}</h1>\n  <p>Start building here...</p>\n</div>`
    : undefined;

  return (
    <PlaygroundEditor
      onSave={handleSave}
      initialHtml={initialHtml}
    />
  );
}
