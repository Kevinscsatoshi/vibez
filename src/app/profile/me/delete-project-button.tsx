"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePublishedProject } from "./actions";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const toFriendlyError = (raw: string) => {
    if (raw === "not_authenticated") return "Please sign in again and retry.";
    if (raw === "invalid_project_id") return "Invalid project id.";
    if (raw === "not_found_or_forbidden") return "You can only delete your own project.";
    if (raw.startsWith("delete_assets_failed:")) return "Failed to remove uploaded files.";
    if (raw.startsWith("delete_project_failed:")) return "Failed to delete project record.";
    return raw;
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete this published project? This action cannot be undone."
    );
    if (!confirmed) return;

    setError("");
    startTransition(async () => {
      const result = await deletePublishedProject(projectId);
      if (result?.error) {
        setError(toFriendlyError(result.error));
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
