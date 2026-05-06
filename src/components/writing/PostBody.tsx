"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";

type Props = {
  content: string;
};

export default function PostBody({ content }: Props) {
  return (
    <div className="prose">
      <MarkdownPreview source={content} />
    </div>
  );
}
