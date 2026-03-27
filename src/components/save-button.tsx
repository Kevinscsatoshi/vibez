"use client";

import { useState, useTransition } from "react";
import { BookmarkSimple } from "@phosphor-icons/react";
import { toggleSave } from "@/app/actions/saves";

interface SaveButtonProps {
  recipeId: string;
  initialSaved?: boolean;
  initialSaveCount?: number;
  size?: "sm" | "md";
}

export function SaveButton({
  recipeId,
  initialSaved = false,
  initialSaveCount = 0,
  size = "md",
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [count, setCount] = useState(initialSaveCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const next = !saved;
    setSaved(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      try {
        await toggleSave(recipeId);
      } catch {
        setSaved(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  };

  if (size === "sm") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`inline-flex items-center gap-1 text-xs transition-colors ${
          saved ? "text-accent font-medium" : "text-muted hover:text-foreground"
        }`}
      >
        <BookmarkSimple className="h-3.5 w-3.5" weight={saved ? "fill" : "regular"} />
        {count > 0 && <span>{count}</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
        saved
          ? "bg-accent text-white"
          : "bg-foreground text-background hover:opacity-90"
      }`}
    >
      <BookmarkSimple className="h-4 w-4" weight={saved ? "fill" : "regular"} />
      {saved ? "Saved" : "Save"}
      {count > 0 && <span className="text-xs opacity-80">{count}</span>}
    </button>
  );
}
