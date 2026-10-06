import { marked, type Tokens } from "marked";
import { highlight } from "@/lib/highlight";

type Props = {
  content: string;
};

export default async function PostBody({ content }: Props) {
  const html = await marked.parse(content, {
    gfm: true,
    async: true,
    // Highlight fenced code ahead of rendering; blocks in a language that is
    // not loaded keep marked's default escaped output.
    async walkTokens(token) {
      if (token.type !== "code") return;
      const code = token as Tokens.Code;
      const highlighted = await highlight(code.text, code.lang?.split(/\s/)[0]);
      if (highlighted) Object.assign(token, { type: "html", block: true, text: highlighted });
    },
  });

  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
