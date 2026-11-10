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

export const getProjectsWithStats = () => Promise.all(PROJECTS.map(withLiveStats));
