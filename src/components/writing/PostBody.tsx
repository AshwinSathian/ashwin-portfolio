import { marked } from "marked";

type Props = {
  content: string;
};

export default async function PostBody({ content }: Props) {
  const html = await marked.parse(content, { gfm: true });

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
