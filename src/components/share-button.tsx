"use client";

import { useState } from "react";
import { ShareNetwork, Check } from "@phosphor-icons/react";

interface ShareButtonProps {
  url?: string;
  title?: string;
  className?: string;
}

export function ShareButton({ url, title, className = "" }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-full hover:border-foreground/30 transition-colors ${
        shared ? "text-success" : ""
      } ${className}`}
      title={shared ? "Link copied!" : "Share"}
    >
      {shared ? <Check className="h-4 w-4" weight="bold" /> : <ShareNetwork className="h-4 w-4" weight="bold" />}
      {shared ? "Copied!" : "Share"}
    </button>
  );
}
