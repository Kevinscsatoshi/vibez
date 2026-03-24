"use client";

import { useRouter } from "next/navigation";
import { PlaygroundEditor } from "@/components/playground-editor";
import { saveSnippet } from "./actions";

export function PlaygroundClient() {
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

  return (
    <PlaygroundEditor onSave={handleSave} />
  );
}
