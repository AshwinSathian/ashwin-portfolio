import { TOP_PROJECTS } from "@/app/data/top-projects";
import type { ProjectCardProps } from "@/components/ProjectCard";
import {
  fetchRepoLanguages,
  fetchRepoMeta,
  fetchRepoTopics,
  parseRepoUrl,
  type RepoMeta,
} from "@/lib/github";

type ProjectListItem = ProjectCardProps;

function selectPrimaryLanguage(
  languages: Record<string, number> | null | undefined,
  fallback: RepoMeta["language"],
) {
  if (!languages || Object.keys(languages).length === 0) {
    return fallback ?? null;
  }

  let selected: string | null = null;
  let maxBytes = -1;
  for (const [name, bytes] of Object.entries(languages)) {
    if (typeof bytes === "number" && bytes > maxBytes) {
      selected = name;
      maxBytes = bytes;
    }
  }

  return selected ?? fallback ?? null;
}

type ProjectSource = {
  name: string;
  url: string;
};

async function buildProject({
  name,
  url,
}: ProjectSource): Promise<ProjectListItem> {
  const ref = parseRepoUrl(url);
  try {
    const [meta, languages, topics] = await Promise.all([
      fetchRepoMeta(ref),
      fetchRepoLanguages(ref),
      fetchRepoTopics(ref),
    ]);

    return {
      owner: ref.owner,
      repo: ref.repo,
      description: meta.description,
      stargazers_count: meta.stargazers_count,
      language: selectPrimaryLanguage(languages, meta.language),
      topics: topics.names ?? [],
      updated_at: meta.updated_at,
      title: name,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Failed to load GitHub data for ${ref.owner}/${ref.repo}:`,
        error,
      );
    }
    return {
      owner: ref.owner,
      repo: ref.repo,
      topics: [],
      title: name,
    };
  }
}

export async function getTopProjects(): Promise<ProjectListItem[]> {
  const projects = await Promise.all(TOP_PROJECTS.map((project) => buildProject(project)));
  return projects;
}
