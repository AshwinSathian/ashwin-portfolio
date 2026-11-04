// Project slug → slugs of posts written about it (files in src/content/writing).
// Only posts that are about the project itself, not ones that mention it in passing.
export const PROJECT_POSTS: Record<string, string[]> = {
  weir: ["three-gaps-in-a-caching-layer-and-the-go-library-i-built-to-close-them"],
  "ngx-runtime-i18n": [
    "runtime-i18n-for-angular-done-right-ngx-runtime-i18n",
    "why-ngx-runtime-i18n-treats-the-active-language-as-a-signal-not-an-observable",
  ],
  "better-auth-mongoose": ["why-better-auths-mongodb-adapter-cant-populate-a-mongoose-ref"],
  "humanize-writing-skill": [
    "the-ai-tells-moved-my-tool-for-avoiding-them-hadnt",
    "why-humanize-my-writing-tools-dont-work",
  ],
};

/** The project a post is about, if any. */
export function projectForPost(postSlug: string): string | undefined {
  return Object.keys(PROJECT_POSTS).find((slug) => PROJECT_POSTS[slug].includes(postSlug));
}
