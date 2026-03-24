import { ProjectCard } from "@/components/project-card";
import {
  getFeaturedProjects,
  getTrendingProjects,
  getLatestProjects,
} from "@/lib/sample-data";
import Link from "next/link";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const trending = getTrendingProjects();
  const latest = getLatestProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="mb-16 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight leading-tight">
          See what AI builders are actually shipping.
        </h1>
        <p className="mt-3 text-base text-muted leading-relaxed">
          Prompts, stacks, metrics, iterations, failures, and the full build
          story. The structured builder network for people who ship with AI.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="#featured"
            className="bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity rounded-full"
          >
            Browse projects
          </Link>
          <Link
            href="/create"
            className="border border-border px-5 py-2 text-sm font-medium hover:border-foreground/30 transition-colors rounded-full"
          >
            Publish yours
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section id="featured" className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          Featured Projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          Trending
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trending.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Latest */}
      <section className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          Latest Builds
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
