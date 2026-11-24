import type { APIRoute } from "astro";
import { GAMES, GAMES_ARCADE } from "../../data/games";
import { SITE } from "../../data/site";
import { capitalize, numberWord } from "../../lib/text";

export const GET: APIRoute = () => {
  const items = GAMES.map((g) => {
    const links = [`Play: ${g.live}`, ...(g.project ? [`Project page: ${SITE.website}/projects/${g.project}`] : []), ...(g.post ? [`Write-up: ${SITE.website}/writing/${g.post}`] : [])];
    return `## ${g.name}\n\n${g.line}\n\nModes: ${g.modes}\n\n${links.map((l) => `- ${l}`).join("\n")}`;
  }).join("\n\n");
  const body = `# Games\n\nBy Ashwin Sathian. ${SITE.website}/projects/games\n\n> ${capitalize(numberWord(GAMES.length))} small browser games. Each opens in a tab with nothing to install. Arcade: ${GAMES_ARCADE}\n\n${items}\n`;
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};
