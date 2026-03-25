"use client";

import { useState, useTransition } from "react";
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
        <svg className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
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
      <svg className="h-4 w-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {saved ? "Saved" : "Save"}
      {count > 0 && <span className="text-xs opacity-80">{count}</span>}
    </button>
  );
}
