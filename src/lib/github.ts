type FetchOptions = {
  revalidate: number;
  accept?: string;
};

export type RepoRef = { owner: string; repo: string };

const API_ROOT = "https://api.github.com";

function buildHeaders(accept?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept ?? "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function buildUrl(ref: RepoRef, suffix = "") {
  const { owner, repo } = ref;
  return `${API_ROOT}/repos/${owner}/${repo}${suffix}`;
}

async function handleResponse<T>(
  response: Response,
  ref: RepoRef,
  resource: string,
): Promise<T> {
  if (!response.ok) {
    let details = "";
    try {
      const body = await response.json();
      details = body?.message ? ` - ${body.message}` : "";
    } catch {
      // ignore parse errors, keep default details
    }
    throw new Error(
      `GitHub request for ${resource} (${ref.owner}/${ref.repo}) failed with ${response.status}${details}`,
    );
  }
  return response.json() as Promise<T>;
}

function fetchJson<T>(ref: RepoRef, suffix: string, options: FetchOptions) {
  return fetch(buildUrl(ref, suffix), {
    headers: buildHeaders(options.accept),
    next: { revalidate: options.revalidate },
  }).then((response) => handleResponse<T>(response, ref, suffix || "meta"));
}

export function parseRepoUrl(url: string): RepoRef {
  try {
    const normalized = url.replace(/\.git$/, "").replace(/\/+$/, "");
    const parsed = new URL(normalized);
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      throw new Error("Missing owner or repository segment.");
    }
    const [owner, repo] = parts;
    return { owner, repo };
  } catch (error) {
    const reason =
      error instanceof Error && error.message ? ` (${error.message})` : "";
    throw new Error(`Invalid GitHub repository URL: ${url}${reason}`);
  }
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

export function fetchRepoMeta(ref: RepoRef) {
  return fetchJson<RepoMeta>(ref, "", { revalidate: 3600 });
}

export function fetchRepoLanguages(ref: RepoRef) {
  return fetchJson<Record<string, number>>(ref, "/languages", {
    revalidate: 3600,
  });
}

export function fetchRepoTopics(ref: RepoRef) {
  return fetchJson<{ names?: string[] }>(ref, "/topics", {
    revalidate: 3600,
    accept: "application/vnd.github.mercy-preview+json",
  });
}

export async function fetchReadmeMarkdown(ref: RepoRef) {
  const response = await fetch(buildUrl(ref, "/readme"), {
    headers: {
      ...buildHeaders("application/vnd.github.v3.raw"),
    },
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    let details = "";
    try {
      const body = await response.json();
      details = body?.message ? ` - ${body.message}` : "";
    } catch {
      // ignore parse errors
    }
    throw new Error(
      `GitHub README request (${ref.owner}/${ref.repo}) failed with ${response.status}${details}`,
    );
  }

  return response.text();
}
