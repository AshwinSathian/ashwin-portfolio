import { PROJECTS, type Project } from "@/app/data/projects";
import { fetchRepoMeta } from "@/lib/github";

export type ProjectWithStats = Project & {
  stars?: number;
  language?: string | null;
};

async function withLiveStats(project: Project): Promise<ProjectWithStats> {
  if (!project.repo) return project;

  const meta = await fetchRepoMeta(project.repo);
  if (!meta) return project;

  return { ...project, stars: meta.stargazers_count, language: meta.language };
}

export async function getProjects(): Promise<ProjectWithStats[]> {
  return Promise.all(PROJECTS.map(withLiveStats));
}

export async function getProject(slug: string): Promise<ProjectWithStats | undefined> {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return undefined;
  return withLiveStats(project);
}
