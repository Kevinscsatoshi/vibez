"use client";

import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/database";
import { useUiPreferences } from "@/components/providers/ui-preferences-provider";

interface HomeSectionsProps {
  featured: Project[];
  trending: Project[];
  latest: Project[];
}

export function HomeSections({ featured, trending, latest }: HomeSectionsProps) {
  const { t } = useUiPreferences();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <section id="featured" className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          {t("home.featured")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} showPreview={false} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          {t("home.trending")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trending.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} showPreview={false} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          {t("home.latest")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {latest.map((project) => (
            <ProjectCard key={project.id} project={project} showPreview={false} />
          ))}
        </div>
      </section>
    </div>
  );
}
