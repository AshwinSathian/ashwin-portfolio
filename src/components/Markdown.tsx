"use client";

import MarkdownPreview, {
  type MarkdownPreviewProps,
} from "@uiw/react-markdown-preview";

export type MarkdownProps = {
  md: string;
  owner?: string;
  repo?: string;
  defaultBranch?: string;
  className?: string;
};

export default function Markdown({
  md,
  owner,
  repo,
  defaultBranch = "main",
  className = "",
}: MarkdownProps) {
  const isRelative = (url: string) => !/^[a-z]+:\/\//i.test(url);

  const rawBase =
    owner && repo
      ? `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/`
      : "";
  const blobBase =
    owner && repo
      ? `https://github.com/${owner}/${repo}/blob/${defaultBranch}/`
      : "";

  const components: MarkdownPreviewProps["components"] = {
    a: (props) => {
      const href = typeof props.href === "string" ? props.href : "";
      const fixed =
        isRelative(href) && blobBase
          ? `${blobBase}${href.replace(/^\.?\//, "")}`
          : href;

      return <a {...props} href={fixed} target="_blank" rel="noopener noreferrer" />;
    },
    img: (props) => {
      const src = typeof props.src === "string" ? props.src : "";
      const fixed =
        isRelative(src) && rawBase
          ? `${rawBase}${src.replace(/^\.?\//, "")}`
          : src;
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} src={fixed} alt={props.alt ?? ""} />;
    },
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <MarkdownPreview
        source={md}
        components={components}
        className="max-w-none"
        style={{
          background: "transparent",
          fontSize: "0.95rem",
          lineHeight: 1.75,
        }}
      />
    </div>
  );
}
