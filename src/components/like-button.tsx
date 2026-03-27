"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "@phosphor-icons/react";
import { toggleLike } from "@/app/actions/likes";
import { isUuid } from "@/lib/is-uuid";

interface LikeButtonProps {
  projectId: string;
  initialLikeCount: number;
  initialLiked: boolean;
  size?: "sm" | "md";
}

export function LikeButton({
  projectId,
  initialLikeCount,
  initialLiked,
  size = "sm",
}: LikeButtonProps) {
  if (!isUuid(projectId)) {
    return null;
  }

  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialLikeCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? c - 1 : c + 1));

    startTransition(async () => {
      const result = await toggleLike(projectId);

      if (result.error === "not_authenticated") {
        // Revert optimistic update
        setLiked(wasLiked);
        setCount((c) => (wasLiked ? c + 1 : c - 1));
        router.push(`/signin?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (result.error) {
        // Revert on error
        setLiked(wasLiked);
        setCount((c) => (wasLiked ? c + 1 : c - 1));
        if (typeof window !== "undefined") {
          if (result.error === "invalid_project_id") {
            window.alert("This sample project cannot be liked.");
          } else {
            window.alert(`Like failed: ${result.error}`);
          }
        }
        return;
      }

      // Sync other cards/pages (single-like mode can affect other projects).
      router.refresh();
    });
  };

  const isSm = size === "sm";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1 transition-colors ${
        isSm ? "text-xs" : "text-sm"
      } ${
        liked
          ? "text-red-500"
          : "text-muted hover:text-red-500"
      } disabled:opacity-60`}
      title={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={isSm ? "h-3.5 w-3.5" : "h-4.5 w-4.5"}
        weight={liked ? "fill" : "regular"}
      />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
