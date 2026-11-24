// The browser games, shown on the site as one item: /projects/games.
// Names, one-liners and modes match the arcade at games.ashwinsathian.com
// (read on 24 November 2026). `project` is the slug of a full page under
// /projects, for the games that have one; `post` is a post written about the game.

export type Game = {
  slug: string;
  name: string;
  line: string;
  modes: string;
  live: string;
  github: string;
  project?: string;
  post?: string;
};

export const GAMES_ARCADE = "https://games.ashwinsathian.com";

export const GAMES: Game[] = [
  {
    slug: "clover",
    name: "Clover",
    line: "A top-down 3D maze game: cut the long grass in a hedge maze with a robot mower while four geese try to catch it.",
    modes: "Garden, Daily, Calm, Ghost race",
    live: "https://clover.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/clover",
  },
  {
    slug: "coil",
    name: "Coil",
    line: "Snake with five modes, replays you share as a link and a daily board the server scores itself.",
    modes: "Classic, Gates, Daily, Blitz, Zen",
    live: "https://coil.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/coil",
    project: "coil",
    post: "coils-leaderboard-never-asks-the-browser-for-a-score",
  },
  {
    slug: "lightkeeper",
    name: "Lightkeeper",
    line: "A pinball table of a lighthouse on a night sea, with multiball, timed watches and replays.",
    modes: "3 balls, 3 minutes, Practice",
    live: "https://lightkeeper.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/lightkeeper",
    post: "a-pinball-replay-is-a-promise-about-the-last-bit-of-every-float",
  },
  {
    slug: "minefield",
    name: "Minefield",
    line: "Minesweeper where every board can be cleared by logic, with hints that show the proof.",
    modes: "Beginner, Intermediate, Expert, Custom, Daily",
    live: "https://minefield.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/minefield",
    project: "minefield",
    post: "a-no-guess-minesweeper-board-is-only-as-honest-as-its-solver",
  },
  {
    slug: "nonet",
    name: "Nonet",
    line: "Sudoku graded by the techniques you need, with hints that teach and a mode that adapts to you.",
    modes: "Easy, Medium, Hard, Expert, Master, Daily, Adaptive",
    live: "https://nonet.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/nonet",
    project: "nonet",
    post: "a-computer-cant-tell-you-how-hard-a-sudoku-is",
  },
  {
    slug: "noughts",
    name: "Noughts",
    line: "Noughts and crosses in three versions, against a bot that has every position worked out or a friend over a link.",
    modes: "Classic, Fading, Ultimate, Online",
    live: "https://noughts.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/noughts",
  },
  {
    slug: "rally",
    name: "Rally",
    line: "Table tennis to eleven against an opponent that reads the ball like a person, or keep-ups on your own.",
    modes: "Match: Casual, Match: Club, Match: Pro, Solo keep-ups",
    live: "https://rally.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/rally",
  },
  {
    slug: "spillway",
    name: "Spillway",
    line: "A 3D endless runner: ride a front door on a hydrofoil through a flooded town and deliver the post.",
    modes: "Open Water, Daily Route, Slack Water, Ghost",
    live: "https://spillway.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/spillway",
  },
  {
    slug: "swish",
    name: "Swish",
    line: "A 3D free throw game: pull the ball back on a slingshot rig, read the dotted arc and shoot on a rooftop court.",
    modes: "Free Throws, Step Back, Shot Clock, Daily, Challenge",
    live: "https://swish.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/swish",
  },
  {
    slug: "typester",
    name: "Typester",
    line: "A typing game where every word buys time, each letter is a keycap and your best run races you as a ghost.",
    modes: "Rush, Sprint, Daily, Drill",
    live: "https://typester.ashwinsathian.com",
    github: "https://github.com/AshwinSathian/typester",
    project: "typester",
  },
];

/** Slugs in PROJECTS whose full page is reached through the Games item. */
export const GAME_PROJECT_SLUGS = GAMES.flatMap((g) => (g.project ? [g.project] : []));
