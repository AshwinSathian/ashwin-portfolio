// Booklet's architecture, drawn as one SVG so connectors are real lines.
// Coordinates are in a 1000-unit-wide viewBox; text uses currentColor so it
// follows the page tokens.

const CLIENTS = [
  ["Browser", "Web UI"],
  ["booklet-cli", "npm"],
  ["CI", "publish-to-booklet"],
  ["AI assistants", "via MCP"],
];

const BOX = "fill-surface-2 stroke-line-strong";
const WIRE = "fill-none stroke-fg-3";

export default function ArchitectureDiagram() {
  return (
    <figure aria-labelledby="architecture-caption" className="reveal flex flex-col gap-5">
      {/* Scrolls sideways on narrow screens instead of shrinking the labels. */}
      <div className="panel overflow-x-auto p-4 lg:p-8">
        <svg
          viewBox="0 0 1000 560"
          role="img"
          aria-label="Four clients (browser, CLI, CI and AI assistants) call one REST API served by booklet-app. AI assistants reach it through booklet-mcp over loopback HTTP. booklet-app reads and writes MongoDB and uses in-house auth."
          className="w-full min-w-160 text-fg lg:min-w-0"
        >
          <text x="0" y="18" className="fill-fg-3 text-[13px]">Clients: all consumers of one REST API</text>
          {CLIENTS.map(([name, sub], i) => {
            const x = i * 256;
            const cx = x + 116;
            // The first three clients talk to booklet-app; AI assistants go through booklet-mcp.
            const targetX = i < 3 ? 250 : 750;
            return (
              <g key={name}>
                <rect x={x} y="36" width="232" height="76" rx="10" className={BOX} />
                <text x={cx} y="70" textAnchor="middle" className="fill-fg text-[15px] font-medium">{name}</text>
                <text x={cx} y="92" textAnchor="middle" className="fill-fg-2 text-[12px]">{sub}</text>
                <path d={`M${cx} 112 V168 H${targetX} V226`} className={WIRE} />
              </g>
            );
          })}

          <text x="0" y="212" className="fill-fg-3 text-[13px]">Application tier: PM2, self-hosted, behind a Cloudflare Tunnel</text>
          <rect x="60" y="226" width="380" height="92" rx="10" className={BOX} />
          <text x="250" y="264" textAnchor="middle" className="fill-fg text-[16px] font-medium">booklet-app</text>
          <text x="250" y="290" textAnchor="middle" className="fill-fg-2 text-[12px]">Next.js 16 · web UI + REST API · :3100</text>

          <rect x="560" y="226" width="380" height="92" rx="10" className={BOX} />
          <text x="750" y="264" textAnchor="middle" className="fill-fg text-[16px] font-medium">booklet-mcp</text>
          <text x="750" y="290" textAnchor="middle" className="fill-fg-2 text-[12px]">MCP bridge · :8788 · 5 tools</text>

          <path d="M560 272 H440" className={WIRE} markerEnd="url(#arrow)" />
          <text x="500" y="262" textAnchor="middle" className="fill-fg-3 text-[11px]">loopback HTTP</text>

          <path d="M180 318 V436" className={WIRE} />
          <path d="M320 318 V396 H750 V436" className={WIRE} />

          <text x="0" y="422" className="fill-fg-3 text-[13px]">Data + auth</text>
          <rect x="60" y="436" width="380" height="92" rx="10" className={BOX} />
          <text x="250" y="474" textAnchor="middle" className="fill-fg text-[16px] font-medium">MongoDB</text>
          <text x="250" y="500" textAnchor="middle" className="fill-fg-2 text-[12px]">pages, users, sessions</text>

          <rect x="560" y="436" width="380" height="92" rx="10" className={BOX} />
          <text x="750" y="474" textAnchor="middle" className="fill-fg text-[16px] font-medium">In-house auth</text>
          <text x="750" y="500" textAnchor="middle" className="fill-fg-2 text-[12px]">argon2id hashing, HMAC-peppered session tokens</text>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" className="fill-fg-3" />
            </marker>
          </defs>
        </svg>
      </div>
      <figcaption id="architecture-caption" className="max-w-2xl text-small text-fg-2">
        Both processes run under PM2 on a single Mac, reachable only through a Cloudflare Tunnel, with no cloud compute. This replaced a Cloudflare Workers/OpenNext deployment, rolled back 2026-05-25.
      </figcaption>
    </figure>
  );
}
