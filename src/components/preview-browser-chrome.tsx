"use client";

import { useRef, useState, useCallback } from "react";
import { ArrowClockwise, ArrowSquareOut, X, ArrowsOutSimple } from "@phosphor-icons/react";

interface PreviewBrowserChromeProps {
  title?: string;
  srcDoc?: string;
  src?: string;
  onClose?: () => void;
  onRefresh?: () => void;
  sandbox?: string;
  className?: string;
  defaultHeight?: "compact" | "standard" | "tall";
  fullscreen?: boolean;
}

const HEIGHT_MAP = {
  compact: "h-64",
  standard: "h-96",
  tall: "h-[32rem]",
};

export function PreviewBrowserChrome({
  title = "Preview",
  srcDoc,
  src,
  onClose,
  onRefresh,
  sandbox = "allow-scripts",
  className = "",
  defaultHeight = "standard",
  fullscreen = false,
}: PreviewBrowserChromeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<"compact" | "standard" | "tall">(defaultHeight);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
      return;
    }
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (srcDoc) {
      const doc = iframe.srcdoc;
      iframe.srcdoc = "";
      requestAnimationFrame(() => { iframe.srcdoc = doc; });
    } else if (src) {
      iframe.src = iframe.src;
    }
  }, [onRefresh, srcDoc, src]);

  const cycleHeight = useCallback(() => {
    setHeight((h) => (h === "compact" ? "standard" : h === "standard" ? "tall" : "compact"));
  }, []);

  const displayUrl = src
    ? new URL(src, "https://example.com").hostname
    : `vibez://preview/${title.toLowerCase().replace(/\s+/g, "-")}`;

  const containerClass = fullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-background"
    : `border border-border rounded-xl overflow-hidden ${className}`;

  const iframeClass = fullscreen ? "flex-1 w-full bg-white" : `w-full bg-white ${HEIGHT_MAP[height]}`;

  return (
    <div className={containerClass}>
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f0f0] dark:bg-[#2a2a2a] border-b border-border shrink-0">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>

        {/* URL bar */}
        <div className="flex-1 mx-2">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-muted font-mono truncate text-center">
            {displayUrl}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <ArrowClockwise size={14} className="text-muted" />
          </button>
          {!fullscreen && (
            <button
              onClick={cycleHeight}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Resize"
            >
              <ArrowsOutSimple size={14} className="text-muted" />
            </button>
          )}
          {src && (
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Open in new tab"
            >
              <ArrowSquareOut size={14} className="text-muted" />
            </a>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X size={14} className="text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* iframe */}
      <iframe
        ref={iframeRef}
        srcDoc={srcDoc}
        src={!srcDoc ? src : undefined}
        sandbox={sandbox}
        className={iframeClass}
        title={title}
      />
    </div>
  );
}
