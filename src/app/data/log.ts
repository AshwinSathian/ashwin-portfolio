export type LogEntry = {
  /** "YYYY-MM-DD" */
  date: string;
  text: string;
  href: string;
};

export const RECENT_LOG: LogEntry[] = [
  {
    date: "2026-08-17",
    text: "Published humanize-writing-skill, a Claude Code skill for AI-authored writing that doesn't read AI-authored.",
    href: "/projects/humanize-writing-skill",
  },
  {
    date: "2026-08-10",
    text: "Renamed Umbra to Darkframe after finding a naming collision in the Chrome Web Store — and fixed a High-severity CSS injection bug in the same pass.",
    href: "/projects/darkframe",
  },
  {
    date: "2026-05",
    text: "Rolled Booklet off Cloudflare Workers back to a self-hosted process once the operational tradeoffs showed up in production.",
    href: "/projects/booklet",
  },
];
