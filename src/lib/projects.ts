import { PROJECT_ORDER } from "../data/home";
import { PROJECTS, type Project } from "../data/projects";

export type ProjectWithStats = Project & { stars?: number; language?: string | null };

type RepoMeta = { stargazers_count: number; language: string | null };

/** Best effort, once per build: private, renamed or rate-limited repos just get no stats. */
async function withLiveStats(project: Project): Promise<ProjectWithStats> {
  if (!project.repo) return project;
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com/repos/${project.repo.owner}/${project.repo.repo}`, {
      headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return project;
    const meta = (await res.json()) as RepoMeta;
    return { ...project, stars: meta.stargazers_count, language: meta.language };
  } catch {
    return project;
  }
}

/** Projects in the order the groups show them. A project missing from PROJECT_ORDER would silently vanish from "next", so the build fails instead. */
export const ORDERED_PROJECTS: Project[] = PROJECT_ORDER.map((slug) => {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) throw new Error(`SECTIONS names a project that does not exist: ${slug}`);
  return project;
});
if (ORDERED_PROJECTS.length !== PROJECTS.length) {
  const missing = PROJECTS.filter((p) => !PROJECT_ORDER.includes(p.slug)).map((p) => p.slug);
  throw new Error(`Projects not placed in any SECTIONS group: ${missing.join(", ")}`);
}

export const getProjectsWithStats = () => Promise.all(ORDERED_PROJECTS.map(withLiveStats));
