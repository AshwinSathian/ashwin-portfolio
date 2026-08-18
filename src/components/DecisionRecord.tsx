import type { DecisionRecord as DecisionRecordType } from "@/app/data/projects";

export type DecisionRecordProps = {
  record: DecisionRecordType;
};

export default function DecisionRecord({ record }: DecisionRecordProps) {
  return (
    <div className="decision-record rounded-2xl border border-line bg-paper-raised p-6 md:p-8">
      <p className="font-display text-[11px] uppercase tracking-[0.12em] text-ink-muted">
        Decision · {record.date}
      </p>
      <div className="mt-4 flex flex-col gap-1.5 font-display text-[14px] leading-relaxed">
        <p className="decision-line flex gap-3 text-diff-remove">
          <span aria-hidden className="shrink-0">−</span>
          <span>{record.before}</span>
        </p>
        <p className="decision-line flex gap-3 text-diff-add">
          <span aria-hidden className="shrink-0">+</span>
          <span>{record.after}</span>
        </p>
      </div>
      <p className="mt-5 font-body text-[15px] leading-relaxed text-ink-muted">
        <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">
          Why
        </span>{" "}
        {record.why}
      </p>
    </div>
  );
}
