import type { Metadata } from "next";
import Markdown from "@/components/Markdown";
import BackToProjectsButton from "@/components/BackToProjectsButton";
import { TOP_PROJECTS } from "@/app/data/top-projects";
import {
  fetchReadmeMarkdown,
  fetchRepoMeta,
  parseRepoUrl,
  type RepoMeta,
} from "@/lib/github";

type RouteParams = { owner: string; repo: string };
type PageProps = {
  params?: Promise<RouteParams>;
};

export const revalidate = 1800;

async function resolveParams(
  params: PageProps["params"]
): Promise<RouteParams> {
  if (!params) {
    throw new Error("Missing project route params.");
  }
  const resolved = await params;
  return resolved;
}

const projectTitleMap = new Map<string, string>(
  TOP_PROJECTS.map(({ name, url }) => {
    try {
      const { owner, repo } = parseRepoUrl(url);
      return [`${owner}/${repo}`.toLowerCase(), name];
    } catch {
      return [url.toLowerCase(), name];
    }
  })
);

function resolveProjectTitle(owner: string, repo: string) {
  const key = `${owner}/${repo}`.toLowerCase();
  return projectTitleMap.get(key) ?? `${owner}/${repo}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { owner, repo } = await resolveParams(params);
  const projectTitle = resolveProjectTitle(owner, repo);

  try {
    const meta = await fetchRepoMeta({ owner, repo });
    return {
      title: `${projectTitle} – Projects`,
      description:
        meta.description ??
        `Repository overview and README for ${owner}/${repo} on GitHub.`,
      openGraph: {
        title: `${projectTitle} – Projects`,
        description:
          meta.description ??
          `Repository overview and README for ${owner}/${repo} on GitHub.`,
        url: `https://github.com/${owner}/${repo}`,
      },
      twitter: {
        card: "summary",
        title: `${projectTitle} – Projects`,
        description:
          meta.description ??
          `Repository overview and README for ${owner}/${repo} on GitHub.`,
      },
    };
  } catch {
    return {
      title: `${projectTitle} – Projects`,
    };
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { owner, repo } = await resolveParams(params);
  const ref = { owner, repo };
  const projectTitle = resolveProjectTitle(owner, repo);

  const metaPromise: Promise<RepoMeta | null> = fetchRepoMeta(ref)
    .then((meta) => meta)
    .catch((error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `Failed to load metadata for ${owner}/${repo} detail page:`,
          error
        );
      }
      return null;
    });

  const [meta, markdown] = await Promise.all([
    metaPromise,
    fetchReadmeMarkdown(ref),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <div className="mb-8">
        <BackToProjectsButton />
      </div>
      {/* <h1 className="mb-4 font-[var(--font-heading)] text-3xl font-semibold text-text-primary md:text-4xl">
        {projectTitle}
      </h1> */}
      <p className="mb-6 text-xs uppercase tracking-[0.3em] text-text-muted">
        {owner}/{repo}
      </p>
      {meta?.description ? (
        <p className="mb-8 text-base uppercase tracking-[0.3em] text-text-secondary md:text-lg">
          {meta.description}
        </p>
      ) : null}
      <div className="rounded-3xl bg-bg-glass p-6 shadow-glass backdrop-blur-soft md:p-8">
        <Markdown
          md={markdown}
          owner={owner}
          repo={repo}
          defaultBranch={meta?.default_branch ?? "main"}
        />
      </div>
    </main>
  );
}
