export type VerifiedTagProps = {
  /** Value being confirmed, e.g. "MIT" or "argon2id, JWT sessions". Omit for a bare "// verified" confirmation. */
  text?: string;
  /** Pill styling (border + background) for use in a flex-wrap badge row. Defaults to plain inline text. */
  pill?: boolean;
  /** Text size when not a pill (pills are always 11px). Defaults to "sm". */
  size?: "xs" | "sm";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<VerifiedTagProps["size"]>, string> = {
  xs: "text-[10px]",
  sm: "text-[12px]",
};

export default function VerifiedTag({ text, pill = false, size = "sm", className = "" }: VerifiedTagProps) {
  const sizeClasses = pill
    ? "rounded-md border border-signal/20 bg-signal/5 px-2.5 py-1 text-[11px]"
    : SIZE_CLASSES[size];

  return (
    <p className={`font-mono text-signal ${sizeClasses} ${className}`}>
      {text ? `// verified · ${text}` : "// verified"}
    </p>
  );
}
