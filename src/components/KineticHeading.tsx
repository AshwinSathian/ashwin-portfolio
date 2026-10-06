import type { CSSProperties } from "react";

export type KineticHeadingProps = {
  text: string;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

/**
 * Heading whose words rise in one by one while their weight and width settle.
 * Pure CSS (see `.kinetic` in globals.css), so it runs without JavaScript.
 * `data-w` feeds an invisible sizing copy that keeps the line breaks fixed
 * while the visible copy animates.
 */
export default function KineticHeading({ text, as: Tag = "h1", id, className = "" }: KineticHeadingProps) {
  // Hyphenated words are cut after each hyphen so a long name such as
  // "humanize-writing-skill" can still wrap on a narrow screen.
  const words = text.split(" ").map((word) => word.split(/(?<=-)/));
  let i = 0;

  return (
    <Tag id={id} aria-label={text} className={`kinetic ${className}`}>
      {words.map((parts, w) => (
        <span key={w} aria-hidden>
          {parts.map((part) => (
            <span key={i} className="w" data-w={part} style={{ "--i": i++ } as CSSProperties}>
              <span>{part}</span>
            </span>
          ))}{" "}
        </span>
      ))}
    </Tag>
  );
}
