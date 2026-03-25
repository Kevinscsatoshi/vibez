"use client";

import Link from "next/link";
import { RecipeCard } from "@/components/recipe-card";
import type { Project } from "@/types/database";
import { useUiPreferences } from "@/components/providers/ui-preferences-provider";

interface HomeSectionsProps {
  featured: Project[];
  trending: Project[];
  latest: Project[];
}

const PERSONA_PILLS = [
  { label: "Founder", href: "/browse?persona=founder" },
  { label: "Marketer", href: "/browse?persona=marketer" },
  { label: "Student", href: "/browse?persona=student" },
  { label: "Developer", href: "/browse?persona=developer" },
  { label: "Just Exploring", href: "/browse" },
];

const CATEGORIES = [
  { label: "Landing Pages", slug: "landing-page" },
  { label: "Automations", slug: "automation" },
  { label: "Internal Tools", slug: "internal-tool" },
  { label: "Content Creation", slug: "content" },
  { label: "Data & Analytics", slug: "data-tool" },
  { label: "Chatbots", slug: "chatbot" },
  { label: "Mobile Apps", slug: "mobile-app" },
  { label: "Chrome Extensions", slug: "chrome-ext" },
];

const VALUE_PROPS = [
  {
    title: "Recipe-first",
    description: "Not code repos. Structured, step-by-step build instructions anyone can follow.",
  },
  {
    title: "Community-tested",
    description: "See who completed each recipe, what went wrong, and how they fixed it.",
  },
  {
    title: "Remix anything",
    description: "Take any recipe, swap the tools, change the prompts, make it yours.",
  },
];

export function HomeSections({ featured, trending, latest }: HomeSectionsProps) {
  const { t } = useUiPreferences();

  // Beginner recipes for "Start here" section
  const beginnerRecipes = [...trending, ...latest]
    .filter((p) => p.difficulty === "beginner")
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-16 sm:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight whitespace-pre-line">
          {t("home.hero.title")}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
          {t("home.hero.subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/browse"
            className="bg-foreground text-background px-6 py-2.5 text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            {t("home.hero.browseRecipes")}
          </Link>
          <Link
            href="/create"
            className="border border-border px-6 py-2.5 text-sm font-medium rounded-full hover:border-foreground/30 transition-colors"
          >
            {t("home.hero.shareRecipe")}
          </Link>
        </div>
        {/* Persona pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted mr-1">I&apos;m a:</span>
          {PERSONA_PILLS.map((pill) => (
            <Link
              key={pill.label}
              href={pill.href}
              className="px-3 py-1.5 text-xs font-medium border border-border rounded-full hover:bg-tag-bg hover:border-foreground/20 transition-colors"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Right Now */}
      <section className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          {t("home.popular")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(featured.length > 0 ? featured : trending).slice(0, 8).map((project) => (
            <RecipeCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Start Here — Beginner spotlight */}
      {beginnerRecipes.length > 0 && (
        <section className="mb-14">
          <div className="mb-4">
            <h2 className="text-sm font-semibold">{t("home.startHere")}</h2>
            <p className="text-xs text-muted mt-0.5">{t("home.startHere.subtitle")}</p>
          </div>
          <div className="space-y-2">
            {beginnerRecipes.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 hover:border-foreground/20 transition-colors"
              >
                <div className="min-w-0">
                  <span className="font-medium text-sm">{project.title}</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted">
                    <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-medium">
                      Beginner
                    </span>
                    {project.coding_required && (
                      <span>{project.coding_required === "none" ? "No code" : project.coding_required}</span>
                    )}
                    {project.estimated_time && (
                      <span>{project.estimated_time}</span>
                    )}
                    {project.stack_tags.slice(0, 2).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted shrink-0 ml-3">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Browse by what you want to build */}
      <section className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          {t("home.browseByGoal")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/browse?category=${cat.slug}`}
              className="flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-4 text-sm font-medium hover:bg-tag-bg hover:border-foreground/20 transition-colors text-center"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="mb-14">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          {t("home.latest")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {latest.slice(0, 8).map((project) => (
            <RecipeCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Why VibeZ */}
      <section className="mb-14 border-t border-border pt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-6 text-center">
          {t("home.whyVibez")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="text-center">
              <h3 className="font-semibold text-sm mb-1.5">{prop.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{prop.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mb-10 text-center border-t border-border pt-10">
        <p className="text-sm text-muted mb-4">Ready to share how you build?</p>
        <Link
          href="/create"
          className="bg-foreground text-background px-6 py-2.5 text-sm font-medium rounded-full hover:opacity-90 transition-opacity inline-block"
        >
          Share a Recipe
        </Link>
      </section>
    </div>
  );
}
