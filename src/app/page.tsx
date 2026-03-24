import { ProjectCard } from "@/components/project-card";
import {
  getFeaturedProjects,
  getTrendingProjects,
  getLatestProjects,
} from "@/lib/sample-data";

export default function HomePage() {
  const featured = getFeaturedProjects();
  const trending = getTrendingProjects();
  const latest = getLatestProjects();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Featured */}
      <section id="featured" className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          Featured Projects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {latest.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
