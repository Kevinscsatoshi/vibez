"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GithubSyncButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const json = (await resp.json()) as { error?: string };
      if (!resp.ok) {
        setError(json.error ?? "Sync failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-tag-bg/40 px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted">GitHub linked. Sync latest README and metadata.</p>
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            loading
              ? "cursor-not-allowed border-border text-muted"
              : "border-border hover:border-foreground/30"
          }`}
        >
          {loading ? "Syncing..." : "Sync now"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
