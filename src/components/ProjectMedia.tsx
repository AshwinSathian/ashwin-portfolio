import Image from "next/image";
import type { ProjectMedia as ProjectMediaData } from "@/app/data/projects";

export type ProjectMediaProps = {
  media: ProjectMediaData;
  priority?: boolean;
};

export default function ProjectMedia({ media, priority }: ProjectMediaProps) {
  return (
    <div className="flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/8 bg-surface-2 md:h-80">
      {media.kind === "screenshot" && (
        <div className="flex h-full w-full flex-col">
          <div className="flex shrink-0 items-center gap-1.5 border-b border-white/6 bg-surface-1 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div className="relative flex-1">
            <Image
              src={media.src}
              alt={media.alt}
              fill
              priority={priority}
              className="object-cover object-top"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      )}

      {media.kind === "code" && (
        <div className="flex h-full w-full flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-white/6 bg-surface-1 px-4 py-2.5">
            <span className="font-mono text-[12px] text-ink-3">{media.caption}</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-4">
              {media.language}
            </span>
          </div>
          <pre className="flex-1 overflow-auto p-5 font-mono text-[13px] leading-[1.7] text-ink-1">
            <code>{media.snippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
