export type RepoRef = { owner: string; repo: string };

const API_ROOT = "https://api.github.com";

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export type RepoMeta = {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
  default_branch: string;
};

/** Best-effort repo lookup — returns null for private, renamed, or rate-limited repos. */
export async function fetchRepoMeta({ owner, repo }: RepoRef): Promise<RepoMeta | null> {
  try {
    const response = await fetch(`${API_ROOT}/repos/${owner}/${repo}`, {
      headers: buildHeaders(),
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return (await response.json()) as RepoMeta;
  } catch {
    return null;
  }
}
