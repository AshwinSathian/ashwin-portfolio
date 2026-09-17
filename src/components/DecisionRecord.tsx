import type { DecisionRecord as DecisionRecordType } from "@/app/data/projects";

export type DecisionRecordProps = {
  record: DecisionRecordType;
};

export default function DecisionRecord({ record }: DecisionRecordProps) {
  return (
    <div className="decision-record rounded border border-line bg-paper-raised p-6 md:p-8">
      <p className="font-data text-[11px] uppercase tracking-[0.12em] text-ink-muted">
        Revised · {record.date}
      </p>
      <div className="mt-4 flex flex-col gap-2 font-data text-[14px] leading-relaxed">
        <p className="decision-line flex gap-3 text-ink-muted">
          <span aria-hidden className="shrink-0 text-ink-muted/60">was</span>
          <span className="line-through decoration-ink-muted/50">{record.before}</span>
        </p>
        <p className="decision-line flex gap-3 text-ink">
          <span aria-hidden className="shrink-0 text-accent">now</span>
          <span>{record.after}</span>
        </p>
      </div>
      <p className="mt-5 font-body text-[15px] leading-relaxed text-ink-muted">
        <span className="font-ui text-[11px] font-semibold uppercase tracking-widest text-ink">
          Why
        </span>{" "}
        {record.why}
      </p>
    </div>
  );
}
