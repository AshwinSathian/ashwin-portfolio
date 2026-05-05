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
  if (!params) throw new Error("Missing project route params.");
  return await params;
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
  return projectTitleMap.get(`${owner}/${repo}`.toLowerCase()) ?? `${owner}/${repo}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await resolveParams(params);
  const projectTitle = resolveProjectTitle(owner, repo);
  try {
    const meta = await fetchRepoMeta({ owner, repo });
    return {
      title: `${projectTitle} — Projects`,
      description:
        meta.description ??
        `Repository overview and README for ${owner}/${repo}.`,
    };
  } catch {
    return { title: `${projectTitle} — Projects` };
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { owner, repo } = await resolveParams(params);
  const projectTitle = resolveProjectTitle(owner, repo);

  const [meta, markdown] = await Promise.all([
    fetchRepoMeta({ owner, repo }).catch((): RepoMeta | null => null),
    fetchReadmeMarkdown({ owner, repo }),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 pt-29 md:px-8 md:py-32 md:pt-33">
      <div className="mb-8">
        <BackToProjectsButton />
      </div>

      <h1 className="mb-2 text-[clamp(24px,4vw,40px)] font-extralight leading-[1.1] tracking-[-0.025em] text-label-1">
        {projectTitle}
      </h1>
      <p className="mb-2 text-[13px] text-label-3">{owner}/{repo}</p>

      {meta?.description && (
        <p className="mb-10 text-[17px] leading-[1.7] text-label-2">
          {meta.description}
        </p>
      )}

      <div className="rounded-2xl border border-white/8 bg-surface-2 p-6 md:p-8">
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
