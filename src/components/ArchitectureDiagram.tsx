const TIER_BOX =
  "flex flex-col gap-1 rounded border border-line bg-paper-raised px-4 py-3 text-center";

export default function ArchitectureDiagram() {
  return (
    <figure aria-labelledby="architecture-diagram-caption" className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <p className="font-data text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          Clients — all consumers of one REST API
        </p>
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            "Browser (Web UI)",
            "booklet-cli (npm)",
            "booklet-vscode (Marketplace)",
            "CI, via publish-to-booklet (GitHub Action)",
            "AI assistants, via MCP",
          ].map((label) => (
            <div key={label} className={TIER_BOX}>
              <span className="font-body text-[13px] leading-snug text-ink">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden className="mx-auto font-data text-ink-muted">↓</div>

      <div className="flex flex-col items-center gap-3">
        <p className="font-data text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          Application tier — PM2, self-hosted, behind a Cloudflare Tunnel
        </p>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-2xl">
          <div className={TIER_BOX}>
            <span className="font-body text-[13px] font-medium text-ink">booklet-app</span>
            <span className="font-data text-[12px] text-ink-muted">Next.js 16 · web UI + REST API · :3100</span>
          </div>
          <div className={TIER_BOX}>
            <span className="font-body text-[13px] font-medium text-ink">booklet-mcp</span>
            <span className="font-data text-[12px] text-ink-muted">
              MCP bridge · :8788 · 5 tools → calls booklet-app over loopback HTTP
            </span>
          </div>
        </div>
      </div>

      <div aria-hidden className="mx-auto font-data text-ink-muted">↓</div>

      <div className="flex flex-col items-center gap-3">
        <p className="font-data text-[11px] uppercase tracking-[0.12em] text-ink-muted">
          Data + auth
        </p>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-2xl">
          <div className={TIER_BOX}>
            <span className="font-body text-[13px] font-medium text-ink">MongoDB</span>
            <span className="font-data text-[12px] text-ink-muted">pages, users, sessions</span>
          </div>
          <div className={TIER_BOX}>
            <span className="font-body text-[13px] font-medium text-ink">In-house auth</span>
            <span className="font-data text-[12px] text-ink-muted">
              argon2id password hashing, HMAC-peppered session tokens
            </span>
          </div>
        </div>
      </div>

      <figcaption
        id="architecture-diagram-caption"
        className="mx-auto max-w-xl text-center font-body text-[14px] leading-relaxed text-ink-muted"
      >
        Both processes run under PM2 on a single Mac, reachable only through a Cloudflare Tunnel — no cloud compute. This replaced a Cloudflare Workers/OpenNext deployment, rolled back 2026-05-25 once its operational tradeoffs showed up in production.
      </figcaption>
    </figure>
  );
}
