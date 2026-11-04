import type { CSSProperties } from "react";

export type KineticHeadingProps = {
  text: string;
  style?: CSSProperties;
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
/**
 * Font size that keeps `text` to two lines: the given scale step, or smaller
 * when the text is long for the measure. Assumes about 0.45em per character
 * (Bricolage at -0.02em measures 0.40 to 0.48) and loses a sixth of each line to word wrap.
 */
export function twoLineSize(text: string, max: string, measure = "min(100vw - 48px, 1104px)") {
  const perChar = 2 / (1.16 * 0.45 * text.length);
  return `min(${max}, calc((${measure}) * ${perChar.toFixed(4)}))`;
}

export default function KineticHeading({ text, as: Tag = "h1", id, className = "", style }: KineticHeadingProps) {
  // Hyphenated words are cut after each hyphen so a long name such as
  // "humanize-writing-skill" can still wrap on a narrow screen.
  const words = text.split(" ").map((word) => word.split(/(?<=-)/));
  let i = 0;

  return (
    <Tag id={id} className={`kinetic ${className}`} style={style}>
      {/* Real text for assistive tech, translation and copy; the animated copy is hidden from them. */}
      <span className="sr-only">{text}</span>
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
