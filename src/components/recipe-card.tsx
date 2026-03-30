"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/types/database";

interface RecipeCardProps {
  project: Project;
  showPreview?: boolean;
  size?: "sm" | "md" | "lg";
  gradientColor?: string;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// particle.news-style colored gradient overlays
const GRADIENT_COLORS = [
  "from-blue-900/60 via-blue-900/20",
  "from-emerald-900/60 via-emerald-900/20",
  "from-amber-900/60 via-amber-900/20",
  "from-rose-900/60 via-rose-900/20",
  "from-violet-900/60 via-violet-900/20",
  "from-cyan-900/60 via-cyan-900/20",
  "from-orange-900/60 via-orange-900/20",
  "from-pink-900/60 via-pink-900/20",
  "from-teal-900/60 via-teal-900/20",
  "from-indigo-900/60 via-indigo-900/20",
  "from-lime-900/60 via-lime-900/20",
  "from-red-900/60 via-red-900/20",
];

const SIZE_CONFIG = {
  sm: { minH: "min-h-[260px]", titleSize: "text-sm font-semibold", showDesc: false },
  md: { minH: "min-h-[320px]", titleSize: "text-base font-bold", showDesc: true },
  lg: { minH: "min-h-[400px]", titleSize: "text-lg font-bold leading-snug", showDesc: true },
};

function getVideoThumbnail(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (parsed.hostname.includes("loom.com")) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const id = parts[parts.length - 1];
      return id ? `https://cdn.loom.com/sessions/thumbnails/${id}-with-play.jpg` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function RecipeCard({ project, size = "md", gradientColor }: RecipeCardProps) {
  const screenshot = project.screenshots[0] ?? null;
  const videoThumb = getVideoThumbnail(project.video_url);
  const previewImage = screenshot ?? videoThumb;
  const difficulty = project.difficulty;
  const [imgLoaded, setImgLoaded] = useState(false);
  const cfg = SIZE_CONFIG[size];

  // Use provided gradient or pick from hash
  const gradient = gradientColor ?? GRADIENT_COLORS[
    Math.abs(project.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % GRADIENT_COLORS.length
  ];

  return (
    <div className={`group relative ${cfg.minH} rounded-[14px] overflow-hidden transition-transform duration-150 ease-elastic hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none`}>
      <Link
        href={`/project/${project.id}`}
        className="absolute inset-0 z-20"
        aria-label={project.title}
      />

      {/* Background image */}
      <div className="absolute inset-0">
        {previewImage ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-surface" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt=""
              className={`h-full w-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
      </div>

      {/* Colored gradient overlay — particle.news style */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent`} />
      {/* Extra dark gradient at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Content — all overlaid on image */}
      <div className="relative z-10 flex flex-col justify-end h-full p-4">
        {/* Top row: metadata */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {project.completion_count > 0 && (
              <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
                {project.completion_count} tried
              </span>
            )}
            {difficulty && (
              <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
                {DIFFICULTY_LABELS[difficulty] ?? difficulty}
              </span>
            )}
          </div>
          {project.estimated_time && (
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
              {project.estimated_time}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`${cfg.titleSize} text-white leading-tight`}>
          {project.title}
        </h3>

        {/* Description */}
        {cfg.showDesc && project.one_liner && (
          <p className="mt-1.5 text-[13px] text-white/60 leading-relaxed line-clamp-2">
            {project.one_liner}
          </p>
        )}
      </div>
    </div>
  );
}
