// The browser games, shown on the site as one item: /projects/games.
// Names, one-liners and modes match the arcade at arcade.ashwinsathian.com
// (read on 24 November 2026). `project` is the slug of a full page under
// /projects, for the games that have one; `post` is a post written about the game.

export type Game = {
  slug: string;
  name: string;
  line: string;
  modes: string;
  live: string;
  project?: string;
  post?: string;
};

export const GAMES_ARCADE = "https://arcade.ashwinsathian.com";
/** The post about the arcade itself: its shared token wallet. */
export const GAMES_ARCADE_POST = "twelve-game-sites-share-one-wallet-with-no-server-behind-it";
/** The arcade is the one games repository that is public. */
export const GAMES_REPO = "https://github.com/AshwinSathian/arcade";

export const GAMES: Game[] = [
  {
    slug: "clover",
    name: "Clover",
    line: "A top-down 3D maze game: cut the long grass in a hedge maze with a robot mower while four geese try to catch it.",
    modes: "Garden, Daily, Calm, Ghost race",
    live: "https://clover.ashwinsathian.com",
    post: "clovers-grass-draw-pays-for-every-cell-even-the-hedges",
  },
  {
    slug: "coil",
    name: "Coil",
    line: "Snake with five modes, replays you share as a link and a daily board the server scores itself.",
    modes: "Classic, Gates, Daily, Blitz, Zen",
    live: "https://coil.ashwinsathian.com",
    post: "coils-3d-board-is-pinned-to-the-page-by-its-projection-matrix",
    project: "coil",
  },
  {
    slug: "glide",
    name: "Glide",
    line: "Air hockey in 3D against a bot at three levels, a friend on the same screen, or a friend online from their own phone.",
    modes: "Play the house: Rookie, Regular, Shark; Same table; Online",
    live: "https://glide.ashwinsathian.com",
    post: "the-puck-belongs-to-whoevers-half-its-in",
  },
  {
    slug: "lightkeeper",
    name: "Lightkeeper",
    line: "A pinball table of a lighthouse on a night sea, with multiball, timed watches and replays.",
    modes: "3 balls, 3 minutes, Practice",
    live: "https://lightkeeper.ashwinsathian.com",
    post: "a-pinball-table-painted-at-boot-costs-less-than-its-pictures",
  },
  {
    slug: "minefield",
    name: "Minefield",
    line: "Minesweeper where every board can be cleared by logic, with hints that show the proof.",
    modes: "Beginner, Intermediate, Expert, Custom, Daily",
    live: "https://minefield.ashwinsathian.com",
    post: "a-minesweeper-hint-can-be-true-and-still-not-show-you-why",
    project: "minefield",
  },
  {
    slug: "nonet",
    name: "Nonet",
    line: "Sudoku graded by the techniques you need, with hints that teach and a mode that adapts to you.",
    modes: "Easy, Medium, Hard, Expert, Master, Daily, Adaptive",
    live: "https://nonet.ashwinsathian.com",
    post: "every-move-in-nonet-is-a-list-of-cells-before-and-after",
    project: "nonet",
  },
  {
    slug: "noughts",
    name: "Noughts",
    line: "Noughts and crosses in three versions, against a bot that has every position worked out or a friend over a link.",
    modes: "Classic, Fading, Ultimate, Online",
    live: "https://noughts.ashwinsathian.com",
    post: "fading-noughts-and-crosses-can-loop-so-its-solver-works-backwards",
  },
  {
    slug: "pinfall",
    name: "Pinfall",
    line: "A 3D ten-pin bowling game: set your spin, pull back to aim and watch real pin physics on a lane whose oil wears as you play.",
    modes: "Game, Daily, Spares, Challenge",
    live: "https://pinfall.ashwinsathian.com",
    post: "a-worn-lane-hooks-later-before-it-hooks-earlier",
  },
  {
    slug: "rally",
    name: "Rally",
    line: "Table tennis to eleven against an opponent that reads the ball like a person, or keep-ups on your own.",
    modes: "Match: Casual, Match: Club, Match: Pro, Solo keep-ups",
    live: "https://rally.ashwinsathian.com",
    post: "a-table-tennis-bot-that-loses-more-when-it-reads-the-ball-perfectly",
  },
  {
    slug: "spillway",
    name: "Spillway",
    line: "A 3D endless runner: ride a front door on a hydrofoil through a flooded town and deliver the post.",
    modes: "Open Water, Daily Route, Slack Water, Ghost",
    live: "https://spillway.ashwinsathian.com",
    post: "spillways-course-check-rejects-one-template-every-time",
  },
  {
    slug: "swish",
    name: "Swish",
    line: "A 3D free throw game: pull the ball back on a slingshot rig, read the dotted arc and shoot on a rooftop court.",
    modes: "Free Throws, Step Back, Shot Clock, Daily, Challenge",
    live: "https://swish.ashwinsathian.com",
    post: "swish-solves-the-whole-free-throw-before-the-ball-leaves-the-hand",
  },
  {
    slug: "typester",
    name: "Typester",
    line: "A typing game where every word buys time, each letter is a keycap and your best run races you as a ghost.",
    modes: "Rush, Sprint, Daily, Drill",
    live: "https://typester.ashwinsathian.com",
    post: "past-60-wpm-faster-typists-get-shorter-runs-in-typesters-rush",
    project: "typester",
  },
];

/** Every post about the arcade or one of its games. */
export const GAME_POSTS = [GAMES_ARCADE_POST, ...GAMES.flatMap((g) => (g.post ? [g.post] : []))];

/** Slugs in PROJECTS whose full page is reached through the Games item. */
export const GAME_PROJECT_SLUGS = GAMES.flatMap((g) => (g.project ? [g.project] : []));
