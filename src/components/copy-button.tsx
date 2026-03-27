"use client";

import { useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: number;
}

export function CopyButton({ text, className = "", size = 16 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center transition-colors ${
        copied ? "text-success" : "text-muted hover:text-foreground"
      } ${className}`}
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? <Check size={size} weight="bold" /> : <Copy size={size} weight="bold" />}
    </button>
  );
}
