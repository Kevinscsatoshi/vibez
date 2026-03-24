import { Project } from "@/types/database";

function searchableBlob(project: Project): string {
  const parts: string[] = [
    project.title,
    project.one_liner,
    project.what_i_built,
    project.why_i_built,
    project.lessons ?? "",
    project.failures ?? "",
    project.github_repo_name ?? "",
    project.github_repo_description ?? "",
    project.github_repo_language ?? "",
    ...project.stack_tags,
    project.author?.display_name ?? "",
    project.author?.github_username ?? "",
  ];
  for (const p of project.prompts) {
    parts.push(p.label, p.prompt, p.model);
  }
  for (const it of project.iterations) {
    parts.push(it.version, it.what_changed, it.result);
  }
  for (const m of project.metrics) {
    parts.push(m.name, m.value, m.timeframe);
  }
  return parts.join("\n").toLowerCase();
}

/** 空格分隔的多个关键词需全部匹配（AND） */
export function filterProjectsByQuery(
  projects: Project[],
  query: string
): Project[] {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return projects;
  return projects.filter((p) => {
    const blob = searchableBlob(p);
    return tokens.every((t) => blob.includes(t));
  });
}
