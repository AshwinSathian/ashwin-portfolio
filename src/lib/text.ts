const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "eight" for 8; falls back to digits past ten. */
export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Cuts at the last word boundary that fits in `max` chars and adds an ellipsis. Never cuts mid-word. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = /\s/.test(text.charAt(max - 1)) ? cut.length : cut.lastIndexOf(" ");
  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[\s,.;:]+$/, "")}…`;
}

const fmt = (opts: Intl.DateTimeFormatOptions) => (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

/** "2026-10-13" to "October 13, 2026". */
export const longDate = fmt({ year: "numeric", month: "long", day: "numeric" });
/** "2026-10-13" to "Oct 2026". */
export const monthYear = fmt({ month: "short", year: "numeric" });
