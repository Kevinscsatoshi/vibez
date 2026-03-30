"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Browser,
  Lightning,
  Wrench,
  PencilSimpleLine,
  ChartBar,
  ChatCircleDots,
  DeviceMobileCamera,
  PuzzlePiece,
  Sparkle,
  Rocket,
  Users,
  ArrowRight,
  Fire,
} from "@phosphor-icons/react";
import { RecipeCard } from "@/components/recipe-card";
import type { Project } from "@/types/database";
import { useUiPreferences } from "@/components/providers/ui-preferences-provider";

interface HomeSectionsProps {
  featured: Project[];
  trending: Project[];
  latest: Project[];
}

const PERSONA_PILLS: { key: "home.persona.business" | "home.persona.marketing" | "home.persona.learning" | "home.persona.developer" | "home.persona.exploring"; href: string }[] = [
  { key: "home.persona.business", href: "/browse?persona=founder" },
  { key: "home.persona.marketing", href: "/browse?persona=marketer" },
  { key: "home.persona.learning", href: "/browse?persona=student" },
  { key: "home.persona.developer", href: "/browse?persona=developer" },
  { key: "home.persona.exploring", href: "/browse" },
];

const CATEGORIES = [
  { label: "Landing Pages", slug: "landing-page", icon: Browser, color: "bg-cat-indigo text-cat-indigo-text" },
  { label: "Automations", slug: "automation", icon: Lightning, color: "bg-cat-amber text-cat-amber-text" },
  { label: "Internal Tools", slug: "internal-tool", icon: Wrench, color: "bg-cat-slate text-cat-slate-text" },
  { label: "Content Creation", slug: "content", icon: PencilSimpleLine, color: "bg-cat-violet text-cat-violet-text" },
  { label: "Data & Analytics", slug: "data-tool", icon: ChartBar, color: "bg-cat-teal text-cat-teal-text" },
  { label: "Chatbots", slug: "chatbot", icon: ChatCircleDots, color: "bg-cat-emerald text-cat-emerald-text" },
  { label: "Mobile Apps", slug: "mobile-app", icon: DeviceMobileCamera, color: "bg-cat-rose text-cat-rose-text" },
  { label: "Chrome Extensions", slug: "chrome-ext", icon: PuzzlePiece, color: "bg-cat-sky text-cat-sky-text" },
];

const FEED_TABS = [
  { label: "Popular", slug: "popular", icon: Fire },
  { label: "Landing Pages", slug: "landing-page", icon: Browser },
  { label: "Automations", slug: "automation", icon: Lightning },
  { label: "Internal Tools", slug: "internal-tool", icon: Wrench },
  { label: "Content", slug: "content", icon: PencilSimpleLine },
  { label: "Data & Analytics", slug: "data-tool", icon: ChartBar },
  { label: "Chatbots", slug: "chatbot", icon: ChatCircleDots },
  { label: "Mobile Apps", slug: "mobile-app", icon: DeviceMobileCamera },
  { label: "Extensions", slug: "chrome-ext", icon: PuzzlePiece },
];

// Gradient colors for cards — particle.news style
const ROW_GRADIENTS = [
  ["from-blue-900/50 via-blue-900/15", "from-amber-800/50 via-amber-800/15", "from-emerald-900/50 via-emerald-900/15"],
  ["from-rose-900/50 via-rose-900/15", "from-green-800/50 via-green-800/15", "from-pink-900/50 via-pink-900/15", "from-cyan-900/50 via-cyan-900/15"],
  ["from-violet-900/50 via-violet-900/15", "from-orange-900/50 via-orange-900/15", "from-indigo-900/50 via-indigo-900/15"],
];

export function HomeSections({ featured, trending, latest }: HomeSectionsProps) {
  const { t } = useUiPreferences();
  const [activeCategory, setActiveCategory] = useState("popular");

  const beginnerRecipes = [...trending, ...latest]
    .filter((p) => p.difficulty === "beginner")
    .slice(0, 3);

  const allProjects = useMemo(() => {
    const seen = new Set<string>();
    const merged: Project[] = [];
    for (const p of [...featured, ...trending, ...latest]) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        merged.push(p);
      }
    }
    return merged;
  }, [featured, trending, latest]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "popular") {
      return [...allProjects].sort(
        (a, b) =>
          (b.like_count ?? 0) + b.fork_count + b.view_count -
          ((a.like_count ?? 0) + a.fork_count + a.view_count)
      );
    }
    const filtered = allProjects.filter((p) => p.category === activeCategory);
    if (filtered.length === 0) return [...allProjects].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return filtered;
  }, [activeCategory, allProjects]);

  const row1 = filteredProjects.slice(0, 3);
  const row2 = filteredProjects.slice(3, 7);
  const row3 = filteredProjects.slice(7, 10);
  const remaining = filteredProjects.slice(10, 14);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6">
      {/* Compact hero banner */}
      <section className="py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-foreground/[0.06]">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight leading-tight whitespace-pre-line">
            {t("home.hero.title")}
          </h1>
          <p className="mt-1 text-sm text-foreground/50 leading-relaxed">
            {t("home.hero.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2 text-sm font-medium rounded-full hover:bg-accent-hover transition-colors"
          >
            {t("home.hero.browseRecipes")}
            <ArrowRight className="h-3.5 w-3.5" weight="bold" />
          </Link>
          <Link
            href="/create"
            className="border border-foreground/15 px-5 py-2 text-sm font-medium rounded-full hover:border-foreground/30 hover:bg-foreground/[0.04] transition-colors"
          >
            {t("home.hero.shareRecipe")}
          </Link>
        </div>
      </section>

      {/* Sidebar category nav + card feed — particle.news layout */}
      <section className="mb-10">
        {/* Mobile horizontal tabs — below lg */}
        <div className="lg:hidden mb-5 -mx-3 px-3 py-3 border-y border-foreground/[0.06] overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2">
            {FEED_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => setActiveCategory(tab.slug)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all duration-150 ${
                    isActive
                      ? "bg-accent/20 text-accent"
                      : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.04]"
                  }`}
                >
                  <Icon className="h-4 w-4" weight={isActive ? "fill" : "regular"} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Vertical category sidebar — particle.news style (desktop only) */}
          <nav className="hidden lg:flex flex-col gap-1 shrink-0 w-48 sticky top-16 self-start pt-2">
            {FEED_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => setActiveCategory(tab.slug)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-[15px] font-medium rounded-full transition-all duration-150 text-left ${
                    isActive
                      ? "bg-accent/20 text-accent"
                      : "text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" weight={isActive ? "fill" : "regular"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Card feed */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Row 1: 3 cards — first one wider */}
            {row1.length > 0 && (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[5fr_4fr_4fr]">
                {row1.map((project, i) => (
                  <RecipeCard
                    key={project.id}
                    project={project}
                    showPreview
                    size={i === 0 ? "lg" : "md"}
                    gradientColor={ROW_GRADIENTS[0]?.[i]}
                  />
                ))}
              </div>
            )}

            {/* Row 2: 4 equal cards */}
            {row2.length > 0 && (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {row2.map((project, i) => (
                  <RecipeCard
                    key={project.id}
                    project={project}
                    showPreview
                    size="sm"
                    gradientColor={ROW_GRADIENTS[1]?.[i]}
                  />
                ))}
              </div>
            )}

            {/* Row 3: 3 cards — middle wider */}
            {row3.length > 0 && (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[3fr_5fr_4fr]">
                {row3.map((project, i) => (
                  <RecipeCard
                    key={project.id}
                    project={project}
                    showPreview
                    size={i === 1 ? "lg" : "md"}
                    gradientColor={ROW_GRADIENTS[2]?.[i]}
                  />
                ))}
              </div>
            )}

            {/* Row 4: remaining */}
            {remaining.length > 0 && (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {remaining.map((project) => (
                  <RecipeCard
                    key={project.id}
                    project={project}
                    showPreview
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Browse by what you want to create */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-4">
          {t("home.browseByGoal")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/browse?category=${cat.slug}`}
                className="flex items-center gap-3 rounded-xl border border-foreground/[0.06] bg-surface/60 px-4 py-4 hover:border-foreground/15 hover:bg-surface/80 transition-all"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${cat.color} shrink-0`}>
                  <Icon className="h-5 w-5" weight="duotone" />
                </span>
                <span className="text-sm font-medium">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-4">
          {t("home.latest")}
        </h2>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[4fr_3fr_5fr]">
          {latest.slice(0, 3).map((project) => (
            <RecipeCard key={project.id} project={project} showPreview size="md" />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-14 border-t border-foreground/[0.06] pt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-6 text-center">
          {t("home.whyVibez")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="text-center flex flex-col items-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cat-indigo text-cat-indigo-text mb-3">
              <Sparkle className="h-5 w-5" weight="duotone" />
            </span>
            <h3 className="font-semibold text-sm mb-1.5">{t("home.valueProp1.title")}</h3>
            <p className="text-xs text-foreground/40 leading-relaxed">{t("home.valueProp1.desc")}</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cat-emerald text-cat-emerald-text mb-3">
              <Users className="h-5 w-5" weight="duotone" />
            </span>
            <h3 className="font-semibold text-sm mb-1.5">{t("home.valueProp2.title")}</h3>
            <p className="text-xs text-foreground/40 leading-relaxed">{t("home.valueProp2.desc")}</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cat-amber text-cat-amber-text mb-3">
              <Rocket className="h-5 w-5" weight="duotone" />
            </span>
            <h3 className="font-semibold text-sm mb-1.5">{t("home.valueProp3.title")}</h3>
            <p className="text-xs text-foreground/40 leading-relaxed">{t("home.valueProp3.desc")}</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mb-10 text-center border-t border-foreground/[0.06] pt-10">
        <p className="text-sm text-foreground/40 mb-4">{t("home.cta.prompt")}</p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-2.5 text-sm font-medium rounded-full hover:bg-accent-hover transition-colors"
        >
          {t("home.cta.button")}
          <ArrowRight className="h-4 w-4" weight="bold" />
        </Link>
      </section>
    </div>
  );
}
