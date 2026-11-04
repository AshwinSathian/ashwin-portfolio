const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "eight" for 8; falls back to digits past ten. */
export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export function capitalize(s: string): string {
  return s[0].toUpperCase() + s.slice(1);
}

/** Cuts at the last word boundary that fits in `max` chars and adds an ellipsis. Never cuts mid-word. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  // If the next char is whitespace, `cut` already ends on a whole word.
  const space = /\s/.test(text[max - 1]) ? cut.length : cut.lastIndexOf(" ");
  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[\s,.;:]+$/, "")}…`;
}
