import {
  fetchRepoMetadata,
  fetchRepoReadme,
  getCurrentUserGithubToken,
} from "@/lib/github";
import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const STACK_CANDIDATES = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Supabase",
  "PostgreSQL",
  "Tailwind CSS",
  "Vercel",
  "Python",
  "FastAPI",
  "Docker",
  "Redis",
  "OpenAI",
  "Claude API",
  "Gemini",
  "GitHub Actions",
];

function pickFirstMeaningfulLine(readme: string): string | null {
  const lines = readme
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.startsWith("#"))
    .filter((l) => !l.startsWith("!"))
    .filter((l) => !l.startsWith("[!["));
  return lines[0] ?? null;
}

function summarizeWhatBuilt(readme: string, fallback: string): string {
  const paragraphs = readme
    .split("\n\n")
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((p) => !p.startsWith("#"))
    .slice(0, 2);

  if (paragraphs.length > 0) {
    return paragraphs.join("\n\n").slice(0, 1200);
  }
  return fallback;
}

function detectStackTags(readme: string, repoLanguage?: string | null): string[] {
  const source = readme.toLowerCase();
  const tags = STACK_CANDIDATES.filter((tag) =>
    source.includes(tag.toLowerCase())
  );
  if (repoLanguage && !tags.includes(repoLanguage)) {
    tags.unshift(repoLanguage);
  }
  return Array.from(new Set(tags)).slice(0, 8);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as { repoFullName?: string };
  const repoFullName = body.repoFullName?.trim();
  if (!repoFullName) {
    return NextResponse.json({ error: "missing_repo_full_name" }, { status: 400 });
  }

  const token = await getCurrentUserGithubToken(user.id);
  if (!token) {
    return NextResponse.json({ error: "github_not_connected" }, { status: 400 });
  }

  try {
    const repo = await fetchRepoMetadata(token, repoFullName);
    const readme = (await fetchRepoReadme(token, repoFullName)) ?? "";
    const firstLine = pickFirstMeaningfulLine(readme);

    const title = repo.name || repoFullName.split("/")[1] || "Imported Project";
    const oneLiner =
      firstLine?.slice(0, 180) ||
      repo.description?.slice(0, 180) ||
      `Imported from ${repoFullName}`;

    const whatIBuilt = summarizeWhatBuilt(
      readme,
      `This project is imported from the public GitHub repository ${repoFullName}.`
    );

    const whyIBuilt =
      repo.description && repo.description.length > 0
        ? `I built this project to solve: ${repo.description}`
        : "I built this project to share a useful workflow and ship faster.";

    return NextResponse.json({
      title,
      one_liner: oneLiner,
      what_i_built: whatIBuilt,
      why_i_built: whyIBuilt,
      stack_tags: detectStackTags(readme, repo.language),
      demo_link: repo.html_url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "readme_draft_failed",
      },
      { status: 500 }
    );
  }
}
